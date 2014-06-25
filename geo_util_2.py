# Improved point in polygon test which includes edge
# and vertex points
import geojson, csv, ipdb
from osgeo import ogr
import subprocess
from clint.textui import progress

def wccount(filename):
   out = subprocess.Popen(['wc', '-l', filename],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.STDOUT
                        ).communicate()[0]
   return int(out.partition(b' ')[0])

zips_file = open('bayarea-zips.geo.json')
police_file = csv.DictReader(open('sfpd/sfpd_incident_2003.csv'))
new_fieldnames = police_file.fieldnames
new_fieldnames.append('ZIP')
new_police_file = csv.DictWriter(open('sfpd/sfpd_incident_with_zip_2003.csv','w+'), fieldnames = new_fieldnames)
new_police_file.writeheader()

polygons = geojson.loads(zips_file.read())

for i, zipcode in enumerate(polygons.geometries):
   polygons.geometries[i]['ogr_poly'] = ogr.CreateGeometryFromJson( geojson.dumps(zipcode) )

for incident in progress.bar( police_file, expected_size=wccount('sfpd/sfpd_incident_2003.csv') ):
   point = ogr.Geometry(ogr.wkbPoint)
   point.AddPoint(float(incident['X']), float(incident['Y']))
   for zipcode in polygons.geometries:
      if zipcode['ogr_poly'].Contains(point):
         incident['ZIP'] = zipcode.zip
         new_police_file.writerow(incident)