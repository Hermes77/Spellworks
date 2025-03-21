from pprint import pprint as print
from collections import OrderedDict
import pandas as pd
import requests
from lxml import html,etree
import json
## This sets some printing options
## that make output look nicer.
pd.set_option('display.width', 133)
pd.set_option('display.max_colwidth', 30)
pd.set_option('display.max_columns', 5)


dnd_domain = 'http://dnd5e.wikidot.com'
choice_domain= 'spells'

dnd_url = (dnd_domain
                + "/"
                + choice_domain)


spell_names = requests.get(dnd_url) #Pulls website data
spells_html = html.fromstring(spell_names.text)
spells_list_html = spells_html.xpath('//*[@id="wiki-tabview-8d4b350373d046fa0c6b0d6db5cd27d6"]/div')
second_spell_html = spells_list_html[0]
#html.open_in_browser(second_spell_html, encoding = 'UTF-8')



real_spellname = []
i=0
#for i in range(1):
spellLink = second_spell_html.xpath(f'//*[@id="wiki-tab-0-{i}"]/div/table/tr/td/a/@href')
spellname = second_spell_html.xpath(f'//*[@id="wiki-tab-0-{i}"]/div/table/tr/td/a')

for k in range(len(spellLink)):
    real_spellname.append(spellname[k].text)
print(spellname)
# full_spells = []
# n = 1
# for j in range(1):#len(spellLink)):
#     spell_details = OrderedDict ({'Spell': '', 'type_level': '', 'info': '', 'Desc': '', 'uplevel': '','Spell lists': '' })
#     spell_url = (dnd_domain + spellLink[n])
#     spellsPull = requests.get(spell_url)
#     spells_html2 = html.fromstring(spellsPull.text)
#     spellsPullinfo = spells_html2.xpath('//*[@id="page-content"]')[0]
#     info = spellsPullinfo.xpath('//*[@id="page-content"]/p')
#     for l,key in enumerate(spell_details.copy().keys()):
#         if len(info) > 5:
#             spell_details[key] = info[l].text_content().strip()
#         else:
#             if key == 'uplevel':
#                 del spell_details['uplevel']
#                 spell_details['Spell lists'] = info[l].text_content().strip()
#                 break
#             else:
#                 spell_details[key] = info[l].text_content().strip()
#
#
#     spell_details.update({'Spell': real_spellname[n]})
#     full_spells.append(spell_details)
#     #print(spell_details)
#     print(f'------------------------{j,len(info)}-------------------------------')
#
# spellObject = json.dumps(full_spells, indent=2)
# with open("Spells.json", "w") as outfile:
#     outfile.write(spellObject)

# This works but does not take into account seperate paragraphs- so I guess thats whats next
# How will it diffreciate between uplevel and more descrition? I guess it dosnt have to -it just appends it to the end of the descrition


