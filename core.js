/* Shared, dependency-free search and score-layout functions. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SwaraCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const normalize = value => String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_~|()[\]।॥ऽ]/g,' ').replace(/\s+/g,' ').trim();
  const phonetic = value => normalize(value).replace(/aa/g,'a').replace(/ee/g,'i').replace(/oo/g,'u').replace(/sh/g,'s').replace(/th/g,'t').replace(/dh/g,'d').replace(/\s+/g,'');
  function romanizeDevanagari(value){
    const letters={क:'k',ख:'kh',ग:'g',घ:'gh',ङ:'ng',च:'ch',छ:'chh',ज:'j',झ:'jh',ञ:'ny',ट:'t',ठ:'th',ड:'d',ढ:'dh',ण:'n',त:'t',थ:'th',द:'d',ध:'dh',न:'n',प:'p',फ:'ph',ब:'b',भ:'bh',म:'m',य:'y',र:'r',ल:'l',व:'v',श:'sh',ष:'sh',स:'s',ह:'h',ळ:'l'};
    const vowels={अ:'a',आ:'a',इ:'i',ई:'i',उ:'u',ऊ:'u',ऋ:'ri',ए:'e',ऐ:'ai',ओ:'o',औ:'au'},marks={'ा':'a','ि':'i','ी':'i','ु':'u','ू':'u','ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au','्':''};
    const chars=Array.from(value);let out='';for(let i=0;i<chars.length;i++){const c=chars[i];if(letters[c]){out+=letters[c];if(Object.hasOwn(marks,chars[i+1]))out+=marks[chars[++i]];else out+='a';}else if(vowels[c])out+=vowels[c];else if(c==='ं'||c==='ँ')out+='n';else if(c==='ः')out+='h';else if(c==='़')continue;else out+=c;}return out;
  }
  function lyrics(song){return song.blocks.flatMap(b=>b.rows.filter(r=>r.cells.some(c=>c.kind==='lyric')).map(r=>r.cells.filter(c=>c.kind==='lyric').map(c=>c.text.replace(/[ऽ।॥[\]]/g,'')).join(''))).join(' ');}
  function values(song,key){const v=song[key];return Array.isArray(v)?v:[v||'Not specified'];}
  function matches(song,query='',filters={}){
    for(const [key,selected] of Object.entries(filters)){if(selected.length&&!values(song,key).some(v=>selected.includes(v)))return false;}
    const lyric=lyrics(song);const source=[song.title,song.roman,song.nativeTitle,song.aliases,song.searchLyrics,song.raga,song.taal,song.composer,song.singer,song.language,song.script,...song.deities,lyric,romanizeDevanagari(lyric)].join(' ');
    const normal=normalize(source),words=normal.split(/[^a-z]+/).filter(Boolean);
    return normalize(query).split(' ').filter(Boolean).every(t=>/^[a-z]+$/.test(t)?words.some(w=>w.startsWith(t)||phonetic(w).startsWith(phonetic(t))):normal.includes(t));
  }
  function packGroups(groups,width,minCell=52){const chunks=[];let part=[],used=0,start=0;groups.forEach((count,index)=>{const needed=count*minCell+(part.length?8:0);if(part.length&&used+needed>width){chunks.push(part);part=[];used=0;}part.push({count,index,start});used+=count*minCell+(part.length>1?8:0);start+=count;});if(part.length)chunks.push(part);return chunks;}
  function currentColumn(elapsed,columns){const total=Math.max(1,Math.trunc(Number(columns))||1);const ratio=Number.isFinite(elapsed)?elapsed:0;return Math.min(total-1,Math.max(0,Math.floor(ratio*total)));}
  function validate(data){const ids=new Set();data.songs.forEach(s=>{if(ids.has(s.id))throw Error('Duplicate song ID');ids.add(s.id);const n=s.groups.reduce((a,b)=>a+b,0);if(s.groups.length!==s.marks.length)throw Error('Group markers mismatch: '+s.id);const seen=[];for(const b of s.blocks){if(!b.rows.length)throw Error('Empty block');for(const r of b.rows){if(r.cells.length!==n)throw Error('Column mismatch: '+s.id+' row '+r.sourceRow);seen.push(r.sourceRow);}}for(let i=1;i<seen.length;i++)if(seen[i]!==seen[i-1]+1)throw Error('Missing source row: '+s.id);});return true;}
  return {normalize,phonetic,romanizeDevanagari,lyrics,values,matches,packGroups,currentColumn,validate};
});
