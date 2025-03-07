import re
from collections import OrderedDict
import pandas as pd
from bs4 import BeautifulSoup
import requests


SpellListUrl = requests.get('http://dnd5e.wikidot.com/spells')
source1 = BeautifulSoup(SpellListUrl.content, "html.parser")

# the lambda function checks if the href attribute contains "spell" and does not contain "spells".
# If both conditions are true, it returns True, indicating that the tag should be included in the result.
# courtesy of Chatgpt

# allSpellNames = []
# allSpellLinks = []
# for a in source1.find_all(href=lambda href: href and "spell" in href and "spells" not in href):
#     allSpellLinks.append(a['href'])
#     allSpellNames.append(a.text)

def tablePull(SpellContent):

    SpellTablelist = []
    if SpellContent.find('div',attrs={'id': 'page-content'}).find('table') != None:
         #use a 'try' here and if if positive then go into seperate function for finding table data

        table2 = SpellContent.find('div',attrs={'id': 'page-content'}).find('table')
        for each in table2:
            info = each.find('td')
            #print(info)
            matches = dict(re.findall(
                 r'(?is)<strong>\s*([^<]*?)\s*<\/strong>\s*([^<]*?)\s*<', str(info)))

            for k, v in matches.items():
                print(f'{k} ------ {v}')
                print('---------------')

        # for item in table2.find_all('td'):
        #     if item.find('strong'):
        #         boldwords = str(item.find("strong").text)
        #         print(boldwords)
        #         print(item.contents)
        #         #print(re.findall(r'\b(?!' + re.escape(boldwords) + r'\b)\w+',item.stripped_strings))
        #         print('--------------------------------------------------')

            #print(item)
        # for f in SpellContent.find('div',attrs={'id': 'page-content'}).find('table'):
        #     SpellTablelist.append(f)
        # keyword = SpellTablelist.index("STR")
        # modHeaders = []
        # modNumbers = []
        # for i in range(keyword,keyword+12):
        #     if i < keyword+6:
        #         modHeaders.append(SpellTablelist[i])
        #
        #     else:
        #         modNumbers.append(SpellTablelist[i])
        # for j,key in enumerate(modNumbers+modHeaders):
        #     if key == 'STR':
        #         SpellTablelist[j] = modHeaders
        #     if key == 'DEX':
        #         SpellTablelist[j] = modNumbers
        #     SpellTablelist.remove(key)
        #
        # df = pd.DataFrame(SpellTablelist[1:], columns=[SpellTablelist[0]])
        # print(df.to_markdown())




def pull_spellinfo(SpellContent):
    temp = []

    tablePull(SpellContent)

    temp.append(SpellContent.find('div',attrs={'class':'page-title page-header'}).text)
    for l in SpellContent.find('div',attrs={'id': 'page-content'}).strings:
        temp.append(l)
    Spellinfolist = list(filter(lambda a: a != '\n', temp))
    return Spellinfolist
    # Need to do post-processing with a table here ( make separate function for this)
    # also maybe for list as well

def clean_spellinfo(testwords,spell_details):
    #testwords = testwords[1].split()
    for x in range(len(testwords)):
        testwords[x] = re.sub(r'Source: ', '', testwords[x], flags=re.IGNORECASE)
    spell_details['Spell'] = testwords[0]
    keyword = testwords.index("Casting Time:")
    #print(testwords[keyword+1])





testList=['/spell:acid-splash','/spell:alarm','/spell:antagonize','/spell:druidcraft','/spell:summon-celestial','/spell:summon-draconic-spirit','/spell:nathairs-mischief']

spell_details = OrderedDict ({'Spell': '','Source':'', 'School': '','Level':'', 'Casting Time': '','Range':'','Components':'','Duration':'', 'Description': '', 'At Higher Levels': '','Spell lists': '','Link':'' })

#for i in range(len(testList)):
sourceURL = ('http://dnd5e.wikidot.com' + testList[0])
SpellUrlGet = requests.get(sourceURL)
SpellContent = BeautifulSoup(SpellUrlGet.content, "html.parser")
Spellinfolist = pull_spellinfo(SpellContent)
print(Spellinfolist)
#clean_spellinfo(Spellinfolist,spell_details)
#print(spell_details)
