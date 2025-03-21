# this is a program to pull all dnd spell from 'http://dnd5e.wikidot.com'

#Made by Isaak Nathan April 15th,2024
from collections import OrderedDict
import json
import re
import pandas as pd
import requests
import time
from lxml import html

pd.set_option('display.width', 133)
pd.set_option('display.max_colwidth', 30)
pd.set_option('display.max_columns', 5)

start_time = time.time()

dnd_domain = 'http://dnd5e.wikidot.com'
choice_domain= 'spells'

dnd_url = (dnd_domain
                + "/"
                + choice_domain)

spell_names = requests.get(dnd_url) #Pulls website data
spells_html = html.fromstring(spell_names.text)
spells_list_html = spells_html.xpath('//*[@id="wiki-tabview-8d4b350373d046fa0c6b0d6db5cd27d6"]/div')
second_spell_html = spells_list_html[0]


spellPage = 0
real_spellname = []
full_spelllinks = []
for spellPage in range(0,10):
    spellLink = second_spell_html.xpath(f'//*[@id="wiki-tab-0-{spellPage}"]/div/table/tr/td/a/@href')
    spellname = second_spell_html.xpath(f'//*[@id="wiki-tab-0-{spellPage}"]/div/table/tr/td/a')
    for k in range(len(spellLink)):
        real_spellname.append(spellname[k].text)
        full_spelllinks.append(spellLink[k])



full_spells = []
total_count = 0
UA_count = 0
error_tracker = []
Ritualflag = 0
for j in range(len(real_spellname)):
    if "(UA)" in real_spellname[j]:
        print(f" -Ignored {real_spellname[j]}")
        UA_count += 1
        continue
    else:
        print(f"Added {real_spellname[j]}")
        spell_details = OrderedDict ({'Spell': '','Source':'', 'School': '','Level':'', 'Casting Time': '','Range':'','Components':'','Duration':'', 'Description': '', 'At Higher Levels': '','Spell lists': '','Link':'' })
        spell_url = (dnd_domain + full_spelllinks[j])
        spellsPull = requests.get(spell_url)
        spells_html2 = html.fromstring(spellsPull.text)
        spellsPullinfo = spells_html2.xpath('//*[@id="page-content"]')[0]
        info = spellsPullinfo.xpath('//*[@id="page-content"]/p')
        spell_details.update({'Spell': real_spellname[j]})
        spell_details.update({'Link':full_spelllinks[j]})
        for l in range(len(info)):
            if l == 0:
                spell_details['Source'] = re.sub(r'Source: ', '', info[l].text_content().strip(), flags=re.IGNORECASE)
            elif l ==1:
                temp = info[l].text_content().strip()
                type_level = temp.split()
                if '(ritual)' in type_level:
                    Ritualflag = 1
                if 'cantrip' in type_level :
                    spell_details['School'] = type_level[0].title()
                    spell_details['Level'] = type_level[1].title()
                else:
                    spell_details['School'] = type_level[1].title()
                    spell_details['Level'] = type_level[0]
            elif l ==2:
                temp = info[l].text_content().strip()
                info_parts = temp.split('\n')
                for g,key in enumerate(['Casting Time','Range','Components','Duration']):
                    try:
                        if (g == 0) and (Ritualflag == 1):
                            spell_details[key] = re.sub(rf'{key}: ', '', info_parts[g], flags=re.IGNORECASE) + ',Ritual'
                        else:
                            spell_details[key]= re.sub(rf'{key}: ','',info_parts[g],flags=re.IGNORECASE)
                    except:
                        error_tracker.append(f"Error Occured with {real_spellname[j]} at g:{g} and key:{key}")
            elif l == (len(info)-1):
                class_list = re.sub(r'Spell Lists. ', '', info[l].text_content().strip(), flags=re.IGNORECASE)
                spell_details['Spell lists'] = class_list.split(', ')
            else:
                if 'At Higher Levels.' in info[l].text_content().strip():
                    spell_details['At Higher Levels'] = re.sub(r'At Higher Levels. ', '', info[l].text_content().strip(), flags=re.IGNORECASE)
                else:
                    spell_details['Description'] = spell_details['Description'] + info[l].text_content().strip()
        if spell_details['At Higher Levels'] == '':
            del spell_details['At Higher Levels']

        full_spells.append(spell_details)
        total_count += 1

    #print(spell_details)
    #print(f'------------------------{len(info)}-------------------------------')

spellObject = json.dumps(full_spells, indent=2)
with open("Spells.json", "w") as outfile:
    outfile.write(spellObject)
print('--------------------------------')
print(f"Done! Pulled {total_count} Spells, Ignored {UA_count} UA spells. \nThis Prgram took {int(time.time()-start_time)}s")
print(f"Errors occured, Printing: {error_tracker}")



