from flask import (
    Flask,
    abort,
)
from flask_cors import CORS
import sqlite3

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
    columns = ['fid', 'state', 'county', 'name','areaLand','areaWater','lat','lon']
    conn = get_db_connection()
    tract = conn.execute(f'''
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
    WHERE
        fid = {fid}
    ''').fetchone()
    conn.close()
    
    if tract is None:
      abort(404)

    result = dict(zip(columns, tract))
    return {
        "data": result,
    }
