#!/usr/bin/env python
# coding: utf-8

# In[178]:


## This sets some printing options
## that make output look nicer.

from pprint import pprint as print
import pandas as pd
import requests
from lxml import html,etree

pd.set_option('display.width', 133)
pd.set_option('display.max_colwidth', 30)
pd.set_option('display.max_columns', 5)


# In[179]:


dnd_domain = 'http://dnd5e.wikidot.com'
choice_domain= 'spells'

dnd_url = (dnd_domain
                + "/"
                + choice_domain)

print(dnd_url)

spells = requests.get(dnd_url)

spells.headers['Content-Type']


# In[180]:


spells_html = html.fromstring(spells.text)

#html.open_in_browser(spells_html, encoding = 'UTF-8')


# In[181]:


spells_list_html = spells_html.xpath('//*[@id="wiki-tabview-8d4b350373d046fa0c6b0d6db5cd27d6"]/div')
#spells_list_html = spells_html.xpath('//*[@id="wiki-tab-0-0"]/div/table/tbody/tr[2]/td[1]/a')

print(spells_list_html)


# In[182]:


second_spell_html = spells_list_html[0]
#html.open_in_browser(second_spell_html, encoding = 'UTF-8')


# In[229]:


spell_list = []
for i in range(9):
    element = second_spell_html.xpath(f'//*[@id="wiki-tab-0-{i}"]/div/table/tr/td/a/@href')
    for el in element:
        spell_list.append(el)
print(len(spell_list))
#print(element)
spell_url


# In[ ]:





# In[ ]:




