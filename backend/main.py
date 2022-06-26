from typing import OrderedDict
from flask import (
    Flask,
    abort,
)
from flask_cors import CORS
import sqlite3
import fiona

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect("tracts.gpkg")
    return conn

# explode and bounding_box from https://gis.stackexchange.com/a/90554
def explode(coords):
    """Explode a GeoJSON geometry's coordinates object and yield coordinate tuples.
    As long as the input is conforming, the type of the geometry doesn't matter."""
    for e in coords:
        if isinstance(e, (float, int)):
            yield coords
            break
        else:
            for f in explode(e):
                yield f

def bounding_box(coords):
  x, y = zip(*list(explode(coords)))
  return [[min(y), min(x)], [max(y), max(x)]]

# end StackOverflow copy

@app.errorhandler(404)
def resource_not_found(e):
  return {}, 404

@app.route("/tracts")
def list_tracts():
    columns = ['fid', 'state', 'county', 'name','areaLand','areaWater','lat','lon']
    conn = get_db_connection()
    tracts = conn.execute('''
    SELECT 
        fid,
        STATEFP,
        COUNTYFP,
        NAMELSAD,
        ALAND,
        AWATER,
        INTPTLAT,
        INTPTLON
    FROM
        tracts
    ''').fetchall()
    conn.close()

    results = []
    for row in tracts:
        results.append(dict(zip(columns, row)))
    return {
        "tracts": results
    }


@app.route("/tracts/<int:fid>")
def get_tract(fid):
  with fiona.open('tracts.gpkg', layer='tracts') as src:
    columns = OrderedDict([
        ('state', 'STATEFP'),
        ('county', 'COUNTYFP'),
        ('name', 'NAMELSAD'),
        ('areaLand', 'ALAND'),
        ('areaWater', 'AWATER'),
      ])
    result = {
      'fid': fid,
    }
    coordinates = src[fid]['geometry']['coordinates']
    result['coordinates'] = coordinates
    result['bounds'] = bounding_box(coordinates)
    for column in columns.keys():
      result[column] = src[fid]['properties'][columns[column]]

    return {
      "data": result
    }
