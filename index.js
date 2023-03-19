const cs = require('cloudscraper')
const ch = require('cheerio')
const PDFDocument = require('pdfkit')
const axios = require('axios')
let creator = '@lui' //ini wm

class server1 {
search = (q, page) => {
return new Promise( async(resolve, reject) => {
const peg = page ? parseInt(page) : parseInt(1)
try {
//with url
if (q.startsWith('https')) {
var html = await cs.get(q)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
//with text atau dengan page = optional
let url = 'https://komikdewasa.info/page/' + peg +'/?s=' + q
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

update = (page) => {
return new Promise( async(resolve, reject) => {
let peg = page ? parseInt(page) : parseInt(1)
try {
if (/https/.test(page)) {
var html = await cs.get(page)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikdewasa.info/komik/?page=' + peg + '&order=update'
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

information = (url) => {
return new Promise(async (resolve, reject) => {
try {
let ingfo = {};
let chlist = [];
var html = await cs.get(url)
var data = ch.load(html)
ingfo["title"] = data('.entry-title').text()
ingfo["thumbnail"] = data('.thumb > img').attr('src')
ingfo["followers"] = data('.bmc').text()
ingfo["rating"] = data('.rating > .rating-prc > .num').attr('content')
data('table[class=infotable] > tbody > tr').each(function (a, b) {
ingfo[data(b).find("td:nth-child(1)").text().toLowerCase().replace(/ /g, '_')] = data(b)
.find('td:nth-child(2)')
.text()
.trim()
})
data('#chapterlist > ul > li').each(function (a, b) {
chlist.push({
title: data(b).find('.chbox > .eph-num > a > .chapternum').text(),
date: data(b).find('.chbox > .eph-num > a > .chapterdate').text(),
url: data(b).find('.chbox > .eph-num > a').attr('href')
})
})
ingfo["chapter_list"] = chlist
resolve({
author: creator,
status: true,
data_response: ingfo
})
} catch (e) {
resolve({
author: creator,
status: false,
data_response: e
})
}
})
}

read = async (url) => {
return new Promise(async (resolve, reject) => {
try {
var html = await cs.get(url)
var data = ch.load(html)
var brody = JSON.parse(data('#content > div.wrapper > script:nth-child(4)').html().replaceAll('ts_reader.run', '').replace('(', '').replace(')', '').replaceAll('!', ''))
brody["title"] = data('.entry-title').text()
resolve({
author: creator,
status: true,
image: brody.sources[0].images,
file_pdf: await toPDF(brody.sources[0].images)
})
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}
}

class server2 {
search = (q, page) => {
return new Promise( async(resolve, reject) => {
const peg = page ? parseInt(page) : parseInt(1)
try {
if (q.startsWith('https')) {
var html = await cs.get(q)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikjos.art/page/' + peg +'/?s=' + q
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

update = (page) => {
return new Promise( async(resolve, reject) => {
let peg = page ? parseInt(page) : parseInt(1)
try {
if (/https/.test(page)) {
var html = await cs.get(page)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikjos.art/manga/?page=' + peg + '&order=update'
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

information = (url) => {
return new Promise(async (resolve, reject) => {
try {
let ingfo = {};
let chlist = [];
var html = await cs.get(url)
var data = ch.load(html)
ingfo["title"] = data('.entry-title').text()
ingfo["thumbnail"] = data('.thumb > img').attr('src')
ingfo["followers"] = data('.bmc').text()
ingfo["rating"] = data('.rating > .rating-prc > .num').attr('content')
data('table[class=infotable] > tbody > tr').each(function (a, b) {
ingfo[data(b).find("td:nth-child(1)").text().toLowerCase().replace(/ /g, '_')] = data(b)
.find('td:nth-child(2)')
.text()
.trim()
})
data('#chapterlist > ul > li').each(function (a, b) {
chlist.push({
title: data(b).find('.chbox > .eph-num > a > .chapternum').text(),
date: data(b).find('.chbox > .eph-num > a > .chapterdate').text(),
url: data(b).find('.chbox > .eph-num > a').attr('href')
})
})
ingfo["chapter_list"] = chlist
resolve({
author: creator,
status: true,
data_response: ingfo
})
} catch (e) {
resolve({
author: creator,
status: false,
data_response: e
})
}
})
}

read = async (url) => {
return new Promise(async (resolve, reject) => {
try {
var html = await cs.get(url)
var data = ch.load(html)
var brody = JSON.parse(data('#content > div.wrapper > script:nth-child(4)').html().replaceAll('ts_reader.run', '').replace('(', '').replace(')', '').replaceAll('!', ''))
brody["title"] = data('.entry-title').text()
resolve({
author: creator,
status: true,
image: brody.sources[0].images,
file_pdf: await toPDF(brody.sources[0].images)
})
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}
}

class server3 {
search = (q, page) => {
return new Promise( async(resolve, reject) => {
const peg = page ? parseInt(page) : parseInt(1)
try {
if (q.startsWith('https')) {
var html = await cs.get(q)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikmirror.art/page/' + peg +'/?s=' + q
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

update = (page) => {
return new Promise( async(resolve, reject) => {
let peg = page ? parseInt(page) : parseInt(1)
try {
if (/https/.test(page)) {
var html = await cs.get(page)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikmirror.art/manga/?page=' + peg + '&order=update'
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

information = (url) => {
return new Promise(async (resolve, reject) => {
try {
let ingfo = {};
let chlist = [];
var html = await cs.get(url)
var data = ch.load(html)
ingfo["title"] = data('.entry-title').text()
ingfo["thumbnail"] = data('.thumb > img').attr('src')
ingfo["followers"] = data('.bmc').text()
ingfo["rating"] = data('.rating > .rating-prc > .num').attr('content')
data('table[class=infotable] > tbody > tr').each(function (a, b) {
ingfo[data(b).find("td:nth-child(1)").text().toLowerCase().replace(/ /g, '_')] = data(b)
.find('td:nth-child(2)')
.text()
.trim()
})
data('#chapterlist > ul > li').each(function (a, b) {
chlist.push({
title: data(b).find('.chbox > .eph-num > a > .chapternum').text(),
date: data(b).find('.chbox > .eph-num > a > .chapterdate').text(),
url: data(b).find('.chbox > .eph-num > a').attr('href')
})
})
ingfo["chapter_list"] = chlist
resolve({
author: creator,
status: true,
data_response: ingfo
})
} catch (e) {
resolve({
author: creator,
status: false,
data_response: e
})
}
})
}

read = async (url) => {
return new Promise(async (resolve, reject) => {
try {
var html = await cs.get(url)
var data = ch.load(html)
var brody = JSON.parse(data('#content > div.wrapper > script:nth-child(4)').html().replaceAll('ts_reader.run', '').replace('(', '').replace(')', '').replaceAll('!', ''))
brody["title"] = data('.entry-title').text()
resolve({
author: creator,
status: true,
title: data('.entry-title').text(),
image: brody.sources[0].images,
file_pdf: await toPDF(brody.sources[0].images)
})
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}
}

class server4 {
search = (q, page) => {
return new Promise( async(resolve, reject) => {
const peg = page ? parseInt(page) : parseInt(1)
try {
if (q.startsWith('https')) {
var html = await cs.get(q)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komiklokal.icu/page/' + peg +'/?s=' + q
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

update = (page) => {
return new Promise( async(resolve, reject) => {
let peg = page ? parseInt(page) : parseInt(1)
try {
if (/https/.test(page)) {
var html = await cs.get(page)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komiklokal.icu/manga/?page=' + peg + '&order=update'
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

information = (url) => {
return new Promise(async (resolve, reject) => {
try {
let ingfo = {};
let chlist = [];
var html = await cs.get(url)
var data = ch.load(html)
ingfo["title"] = data('.entry-title').text()
ingfo["thumbnail"] = data('.thumb > img').attr('src')
ingfo["followers"] = data('.bmc').text()
ingfo["rating"] = data('.rating > .rating-prc > .num').attr('content')
data('table[class=infotable] > tbody > tr').each(function (a, b) {
ingfo[data(b).find("td:nth-child(1)").text().toLowerCase().replace(/ /g, '_')] = data(b)
.find('td:nth-child(2)')
.text()
.trim()
})
data('#chapterlist > ul > li').each(function (a, b) {
chlist.push({
title: data(b).find('.chbox > .eph-num > a > .chapternum').text(),
date: data(b).find('.chbox > .eph-num > a > .chapterdate').text(),
url: data(b).find('.chbox > .eph-num > a').attr('href')
})
})
ingfo["chapter_list"] = chlist
resolve({
author: creator,
status: true,
data_response: ingfo
})
} catch (e) {
resolve({
author: creator,
status: false,
data_response: e
})
}
})
}

read = async (url) => {
return new Promise(async (resolve, reject) => {
try {
var html = await cs.get(url)
var data = ch.load(html)
var brody = JSON.parse(data('#content > div.wrapper > script:nth-child(4)').html().replaceAll('ts_reader.run', '').replace('(', '').replace(')', '').replaceAll('!', ''))
brody["title"] = data('.entry-title').text()
resolve({
author: creator,
status: true,
title: data('.entry-title').text(),
image: brody.sources[0].images,
file_pdf: await toPDF(brody.sources[0].images)
})
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}
}

class server5 {
search = (q, page) => {
return new Promise( async(resolve, reject) => {
const peg = page ? parseInt(page) : parseInt(1)
try {
if (q.startsWith('https')) {
var html = await cs.get(q)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikhot.art/page/' + peg +'/?s=' + q
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

update = (page) => {
return new Promise( async(resolve, reject) => {
let peg = page ? parseInt(page) : parseInt(1)
try {
if (/https/.test(page)) {
var html = await cs.get(page)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikhot.art/series/?page=' + peg + '&order=update'
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

information = (url) => {
return new Promise(async (resolve, reject) => {
try {
let ingfo = {};
let chlist = [];
var html = await cs.get(url)
var data = ch.load(html)
ingfo["title"] = data('.entry-title').text()
ingfo["thumbnail"] = data('.thumb > img').attr('src')
ingfo["followers"] = data('.bmc').text()
ingfo["rating"] = data('.rating > .rating-prc > .num').attr('content')
data('table[class=infotable] > tbody > tr').each(function (a, b) {
ingfo[data(b).find("td:nth-child(1)").text().toLowerCase().replace(/ /g, '_')] = data(b)
.find('td:nth-child(2)')
.text()
.trim()
})
data('#chapterlist > ul > li').each(function (a, b) {
chlist.push({
title: data(b).find('.chbox > .eph-num > a > .chapternum').text(),
date: data(b).find('.chbox > .eph-num > a > .chapterdate').text(),
url: data(b).find('.chbox > .eph-num > a').attr('href')
})
})
ingfo["chapter_list"] = chlist
resolve({
author: creator,
status: true,
data_response: ingfo
})
} catch (e) {
resolve({
author: creator,
status: false,
data_response: e
})
}
})
}

read = async (url) => {
return new Promise(async (resolve, reject) => {
try {
var html = await cs.get(url)
var data = ch.load(html)
var brody = JSON.parse(data('#content > div.wrapper > script:nth-child(4)').html().replaceAll('ts_reader.run', '').replace('(', '').replace(')', '').replaceAll('!', ''))
brody["title"] = data('.entry-title').text()
resolve({
author: creator,
status: true,
title: data('.entry-title').text(),
image: brody.sources[0].images,
file_pdf: await toPDF(brody.sources[0].images)
})
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}
}

class server6 {
search = (q, page) => {
return new Promise( async(resolve, reject) => {
const peg = page ? parseInt(page) : parseInt(1)
try {
if (q.startsWith('https')) {
var html = await cs.get(q)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikseru.me/page/' + peg +'/?s=' + q
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

update = (page) => {
return new Promise( async(resolve, reject) => {
let peg = page ? parseInt(page) : parseInt(1)
try {
if (/https/.test(page)) {
var html = await cs.get(page)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
} else {
let url = 'https://komikseru.me/series/?page=' + peg + '&order=update'
var html = await cs.get(url)
var data = ch.load(html)
let lui = [];
data('.listupd > .bs').each( function(a, b) {
lui.push({
title: data(b).find('.bsx > a').attr('title'),
url: data(b).find('.bsx > a').attr('href'),
thumbnail: data(b).find('.bsx > a > .limit > img').attr('src'),
information: data(b).find('.bsx > a > .limit').text().replaceAll('\n', '').replaceAll('\t', ''),
rating: data(b).find('.bsx > a > .bigor > .adds > .rt').text().replaceAll('\n', '').replaceAll('\t', ''),
last_chapter: data(b).find('.bsx > a > .bigor > .adds > .epxs').text()
}) 
})
resolve({
author: creator,
status: true,
response_data: lui
})
}
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}

information = (url) => {
return new Promise(async (resolve, reject) => {
try {
let ingfo = {};
let chlist = [];
var html = await cs.get(url)
var data = ch.load(html)
ingfo["title"] = data('.entry-title').text()
ingfo["thumbnail"] = data('.thumb > img').attr('src')
ingfo["followers"] = data('.bmc').text()
ingfo["rating"] = data('.rating > .rating-prc > .num').attr('content')
data('table[class=infotable] > tbody > tr').each(function (a, b) {
ingfo[data(b).find("td:nth-child(1)").text().toLowerCase().replace(/ /g, '_')] = data(b)
.find('td:nth-child(2)')
.text()
.trim()
})
data('#chapterlist > ul > li').each(function (a, b) {
chlist.push({
title: data(b).find('.chbox > .eph-num > a > .chapternum').text(),
date: data(b).find('.chbox > .eph-num > a > .chapterdate').text(),
url: data(b).find('.chbox > .eph-num > a').attr('href')
})
})
ingfo["chapter_list"] = chlist
resolve({
author: creator,
status: true,
data_response: ingfo
})
} catch (e) {
resolve({
author: creator,
status: false,
data_response: e
})
}
})
}

read = async (url) => {
return new Promise(async (resolve, reject) => {
try {
var html = await cs.get(url)
var data = ch.load(html)
var brody = JSON.parse(data('#content > div.wrapper > script:nth-child(4)').html().replaceAll('ts_reader.run', '').replace('(', '').replace(')', '').replaceAll('!', ''))
brody["title"] = data('.entry-title').text()
resolve({
author: creator,
status: true,
title: data('.entry-title').text(),
image: brody.sources[0].images,
file_pdf: await toPDF(brody.sources[0].images)
})
} catch (e) {
resolve({
author: creator,
status: false,
response_data: e
})
}
})
}
}

module.exports.KomikDewasa = server1
module.exports.KomikJos = server2
module.exports.KomikMirror = server3
module.exports.KomikLokal = server4
module.exports.KomikHot = server5
module.exports.KomikSeru = server6


async function toPDF(images, opt = {}) {
	return new Promise(async (resolve, reject) => {
		if (!Array.isArray(images)) images = [images]
		let buffs = [], doc = new PDFDocument({ margin: 0, size: 'A4' })
		for (let x = 0; x < images.length; x++) {
			if (/.webp|.gif/.test(images[x])) continue
			let data = (await axios.get(images[x], { responseType: 'arraybuffer', ...opt })).data
			doc.image(data, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' })
			if (images.length != x + 1) doc.addPage()
		}
		doc.on('data', (chunk) => buffs.push(chunk))
		doc.on('end', () => resolve(Buffer.concat(buffs)))
		doc.on('error', (err) => reject(err))
		doc.end()
	})
}





