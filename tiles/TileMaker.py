# -*- coding: utf-8 -*-
"""
Created on Wed Apr 09 16:27:51 2014

@author: Michael Leung
"""
import matplotlib.pyplot as plt

# Desired text
Text = [  2,     4,     8,     16,    32,    64,   128,   256,   512,   1024,  2048,  4096]
#Text = [ 'NE100', 'NE112', 'NE113', 'NE241', 'NE318', 'NE242', 'NE344', 'NE232', 'NE334', 'D Cory', 'D Ban', 'Wendy']

# Desired text color
TCol = ['k','k','w','w','w','w','w','w','w','w','w','w']
# Font Size
FSze = [40,40,40,40,40,40,30,30,30,25,25,25]
#FSze = [20 for ii in Text]
# Desired Back ground color
BGC = ['#eee4da', '#ede0c8', '#f2b179', '#f59563', '#f67c5f', '#f65e3b',
        '#edcf72', '#edcc61', '#edc850', '#edc53f', '#edc22e', '#3c3a32']


for ii in xrange(12):
    fig = plt.figure(num=ii, figsize=(1.06, 1.06))
    # Total image size will be 106 x 106
    fig.text(0.5,0.44, Text[ii], size=FSze[ii], color=TCol[ii], ha="center", va="center")
    fig.savefig(str(ii)+".png", facecolor=BGC[ii])