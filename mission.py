import csv, json
import subprocess
from clint.textui import progress

def wccount(filename):
   out = subprocess.Popen(['wc', '-l', filename],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.STDOUT
                        ).communicate()[0]
   return int(out.partition(b' ')[0])

def do_stuff(year):
    outfile = open('sfpd/mission-police-%s.json' % year,'w+')
    outjson = []
    police_file = csv.DictReader(open('sfpd/sfpd_incident_with_zip_%d.csv' % year))
    for incident in progress.bar( police_file, expected_size=wccount('sfpd/sfpd_incident_with_zip_%d.csv' % year) ):
        if incident['ZIP'] == '94110':
            outjson.append( incident )
    outfile.write(json.dumps(outjson))
    outfile.close

do_stuff(2014)

