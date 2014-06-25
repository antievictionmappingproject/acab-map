import ipdb, csv, json
from datetime import date, time, datetime

def go(year):
    police_file = csv.DictReader(open('sfpd/sfpd_incident_with_zip_%d.csv' % year))
    out = [{} for x in range(12)]

    for incident in police_file:
        date = datetime.strptime('%s %s' % (incident['Date'], incident['Time']),'%m/%d/%Y %H:%M')
        index = int(date.strftime('%m'))-1
        key = out[index].setdefault(incident['ZIP'],0)
        out[index][incident['ZIP']] = key + 1

    outfile = open('sfpd/sfpd_compiled_incidents_%d.json' % year, 'w+')
    outfile.write(json.dumps(out))
    outfile.close()

[go(x) for x in [2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014]]