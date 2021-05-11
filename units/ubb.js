const face = {
    '[抠鼻]': 'em2001',
    '[鼓掌]': 'em2002',
    '[可爱]': 'em2003',
    '[偷笑]': 'em2004',
    '[晕]': 'em2005',
    '[调皮]': 'em2006',
    '[微笑]': 'em2007',
    '[流泪]': 'em2008',
    '[大哭]': 'em2009',
    '[憨笑]': 'em2010',
    '[闭嘴]': 'em2011',
    '[鄙视]': 'em2012',
    '[可怜]': 'em2013',
    '[无语]': 'em2014',
    '[发呆]': 'em2015',
    '[吐]': 'em2016',
    '[流汗]': 'em2017',
    '[翻白眼]': 'em2018',
    '[发怒]': 'em2019',
    '[尴尬]': 'em2020',
    '[亲亲]': 'em2021',
    '[擦汗]': 'em2022',
    '[快哭了]': 'em2023',
    '[色色]': 'em2024',
    '[阴险]': 'em2025',
    '[得意]': 'em2026',
    '[睡觉]': 'em2027',
    '[叹气]': 'em2028',
    '[嘘]': 'em2029',
    '[撇嘴]': 'em2030',
    '[傲慢]': 'em2031',
    '[饿]': 'em2032',
    '[困]': 'em2033',
    '[委屈]': 'em2034',
    '[骷髅]': 'em2035',
    '[敲头]': 'em2036',
    '[惊讶]': 'em2037',
    '[咒骂]': 'em2038',
    '[抓狂]': 'em2039',
    '[奋斗]': 'em2040',
    '[哼哼]': 'em2041',
    '[惊恐]': 'em2042',
    '[衰]': 'em2043',
    '[疑问]': 'em2044',
    '[拜拜]': 'em2045',
    '[强]': 'em2046',
    '[弱爆]': 'em2047',
    '[OK]': 'em2048',
    '[握手]': 'em2049',
    '[胜利]': 'em2050',
    '[大便]': 'em2051',
    '[心碎]': 'em2052',
    '[玫瑰]': 'em2053',
    '[小刀]': 'em2054',
    '[抱拳]': 'em2055'
}
export default {
    face(){
        return face
    },
    check(name) {
        if (!face[name]) {
            return false
        }
        return true
    },
    toUrl(name) {
        return 'https://www1.pcauto.com.cn/autobbs/2013/images/emot/' + face[name] + '.gif'
    },
    str2Json(content) {
        let emots = content.match(/\[[\u4e00-\u9fa5OK]{1,3}\]/g);
        // console.log(emots)
        let con = content;
        let conn = [];
        let json = {};
        let i;
        for (i in emots) {
            con = con.replace(emots[i], '<||>');
        }
        con = con.split('<||>');
        for (i in con) {
            json = {};
            json.type = 'text';
            json.txt = con[i];
            conn.push(json);
            json = {};
            if (this.check(emots[i])) {
            json.type = 'pic';
            json.txt = this.toUrl(emots[i]);
            conn.push(json);
            }
        }
        return conn;
    },
    splitObject(param,number){
        let a=[],
          b=[]
        let index = 0
        let arr = Object.keys(param)
        let pLen=arr.length
        let maxNumber = Math.ceil(pLen/number)
        for(let i in param){
          let item = param[i]
          a.push(item)
          index++
          if(index % number == 0){
            b.push(a)
            a=[]
          }
          if((b.length+1) == maxNumber && pLen == (index)){
            b.push(a)
          }
        }
        return b
    },
}