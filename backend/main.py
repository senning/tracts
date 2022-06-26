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
    LIMIT 0,5
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
    result['coordinates'] = src[fid]['geometry']['coordinates']
    print(src[fid]['properties'])
    for column in columns.keys():
      result[column] = src[fid]['properties'][columns[column]]

    return {
      "data": result
    }

# @app.route("/tracts-fiona/<int:fid>")
# def get_fiona_tract(fid):
#   with fiona.open('tracts.gpkg', layer='tracts') as src:
#     columns = OrderedDict([
#         ('state', 'STATEFP'),
#         ('county', 'COUNTYFP'),
#         ('name', 'NAMELSAD'),
#         ('areaLand', 'ALAND'),
#         ('areaWater', 'AWATER'),
#       ])
#     result = {
#       'fid': fid,
#     }
#     result['coordinates'] = src[fid]['geometry']['coordinates']
#     print(src[fid]['properties'])
#     for column in columns.keys():
#       result[column] = src[fid]['properties'][columns[column]]

#     return {
#       "data": result
#     }