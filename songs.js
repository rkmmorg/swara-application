/* Screenshot transcription. _ marks a visible underline; ~ ends its extent.
 * Rows and blank cells are preserved. Metadata not given in the sheets is null.
 * Deity tags are collection classifications, not text printed in the sheets. */
(function () {
  const row = (kind, sourceRow, text, overrides = {}) => ({kind, sourceRow, cells: text.split(' ').map((text, index) => ({text: text === '·' ? '' : text, kind: overrides[index] || kind}))});
  const N = (number, text, overrides) => row('swara', number, text, overrides);
  const L = (number, text) => row('lyric', number, text);
  const block = (...rows) => ({rows});
  const blanks = '· · · · · · · · · · · · ';
  window.SWARA_DATA = {
    schemaVersion: 1,
    deities: ['Ganesha','Guru','Shiva','Devi','Ram','Krishna','Sri Ramakrishna','Sri Sarada Devi','Swami Vivekananda'],
    songs: [
      {
        id: 'adya-shakti', title: 'आद्या शक्ति मातृ मूर्ति', roman: 'Adya Shakti Matri Murti', nativeTitle:'আদ্যাশক্তি মাতৃমূর্তি',
        language:'Bengali', script:'Devanagari', raga:'Malkaush', taal:'Tevra', composer:null, singer:null,
        deities:['Devi','Sri Sarada Devi'], deityTagSource:'Editorial collection classification',
        aliases:'aadya adyashakti adya shakthi shakti matru matri matrimurti murthi murti malkauns malkosh malkosh malkaush tevra teevra tivra sarada sharada devi আদ্যাশক্তি মাতৃমূর্তি মালকোষ তেওড়া',
        searchLyrics:'adya shakti matri murti sarva avatara janani lilate abar tumi yug avatar sajiacho sita radha sarada swarupini sarva kalyan karini',
        groups:[3,2,2,3,2,2], marks:['×','2','3','×','2','3'], beatsPerCycle:7, source:'https://publications.rkmm.org/svarakusumanjali',
        blocks:[
          block(N(3,'सा _ग सा _नि सा _ध _नि सा म म म - म म'), L(4,'आ ऽ द्या श क ति ऽ मा ऽ तृ मू ऽ र ति')),
          block(N(5,'सा म म म म _ध म _ग _ग म _ग - सा -'), L(6,'श ऽ र्व अ व ता र ज न ऽ नी ऽ ऽ ऽ')),
          block(N(7,'सा म म म - _ग _ग म _ध _नि सां - सां सां'), L(8,'ली ला ते आ ऽ बा र तु मि ना की ऽ शा ज')),
          block(N(9,'म सां सां _नि - _ध म _ग - म _ग - सा -'), L(10,'यु ग अ व ऽ ता र स ऽ जि नी ऽ ऽ ऽ॥')),
          block(N(11,'ग म म _ध - _ध _नि _नि सां सां _गं _नि सां सां'), L(12,'त्रे ता यु गे ऽ तु मि शा जि या छो ऽ शी ता'), L(13,'श ऽ र्व म ऽ ङ्ग ला ज न नी आ ऽ मा र')),
          block(N(14,'म सां सां _नि - _ध _ध म _ध _नि _नि - _नि _नि'), L(15,'द्वा प रे आ ऽ बा र शो जे छो ना ऽ रा धा'), L(16,'हृ द ये क ऽ म ले प्र का श ए ऽ बा र')),
          block(N(17,'सां मं मं मं - मं मं _गं मं मं _गं - सां सां'), L(18,'ए बा रे श ऽ बा र शे ह म यो ऽ मा ता'), L(19,'दे व ता बा न् छि त श्री प द तो ऽ मा र')),
          block(N(20,'म सां _नि _ध - म म _ग - म _ग - सा -'), L(21,'शा र द ऽ ऽ स्व रू र ऽ पि नी ऽ ऽ ऽ'), L(22,'ने हा रि आँ खि भ रि दि व श जा ऽ मि नि')),
          block(N(23,blanks+'[सा सा]'), N(24,blanks+'म -'), N(25,'म म - म - म - म म - _ध - [तु मि]',{12:'lyric',13:'lyric'}), L(26,'क्ष मा ऽ रू ऽ पा ऽ त प ऽ स्वि ऽ नी ऽ')),
          block(N(27,'सा म म म - _ध म _ग _ग म _ग - सा सा'), L(28,'श ऽ र्व क ऽ ल्या ण का रि ऽ नी ऽ तु मि')),
          block(N(29,'म म म म - _ग - म _ध _नि सां - सां सां'), L(30,'तो मा र मा ऽ तृ ऽ शे ह सु र ऽ धु नी')),
          block(N(31,'म सां सां _नि - _ध _ध म _ध _नि _नि - - -'), L(32,'भा शा ल वि ऽ शा ल ध र ऽ नी ऽ ऽ ऽ'))
        ]
      },
      {
        id:'apani-karile',title:'आपनी करिले आपनार पूजा',roman:'Apani Karile Apanar Puja',nativeTitle:'আপনি করিলে আপনার পূজা',
        language:'Bengali',script:'Devanagari',raga:'Nayaki Kanada',taal:'Ektaal',composer:'Swami Premeshananda',singer:null,
        deities:['Sri Ramakrishna'],deityTagSource:'Editorial collection classification',
        aliases:'apni aponi apani korile karile aponar apanar puja pooja nayaki nayeki kanada kanra ektal ektaal premeshananda premesananda ramakrishna ramkrishna আপনি করিলে আপনার পূজা নায়কী কানাড়া একতাল স্বামী প্রেমেশানন্দ',
        searchLyrics:'apani karile apanar puja apanar stuti gan bhavatarinir pujari thakur tumi he amar pran keho bole tumi sadhak pradhan hridaye asan dan',
        groups:[3,3,3,3],marks:['×','2','0','3'],beatsPerCycle:12,source:'https://publications.rkmm.org/svarakusumanjali',blocks:[
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 3,
        "cells": [
          {
            "text": "_नि",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "सा",
            "kind": "swara"
          },
          {
            "text": "_नि",
            "kind": "swara"
          },
          {
            "text": "सा",
            "kind": "swara"
          },
          {
            "text": "_नि~सारे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 4,
        "cells": [
          {
            "text": "आ",
            "kind": "lyric"
          },
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "नि",
            "kind": "lyric"
          },
          {
            "text": "क",
            "kind": "lyric"
          },
          {
            "text": "रि",
            "kind": "lyric"
          },
          {
            "text": "ले",
            "kind": "lyric"
          },
          {
            "text": "आ",
            "kind": "lyric"
          },
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "नाऽऽ",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "पू",
            "kind": "lyric"
          },
          {
            "text": "जा",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 5,
        "cells": [
          {
            "text": "सा",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "पध",
            "kind": "swara"
          },
          {
            "text": "मप",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "-",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 6,
        "cells": [
          {
            "text": "आ",
            "kind": "lyric"
          },
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "ना",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "स्तु",
            "kind": "lyric"
          },
          {
            "text": "ति",
            "kind": "lyric"
          },
          {
            "text": "गा",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "न",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 7,
        "cells": [
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 8,
        "cells": [
          {
            "text": "भ",
            "kind": "lyric"
          },
          {
            "text": "ब",
            "kind": "lyric"
          },
          {
            "text": "ता",
            "kind": "lyric"
          },
          {
            "text": "रे",
            "kind": "lyric"
          },
          {
            "text": "नी",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "पू",
            "kind": "lyric"
          },
          {
            "text": "जा",
            "kind": "lyric"
          },
          {
            "text": "रि",
            "kind": "lyric"
          },
          {
            "text": "ठा",
            "kind": "lyric"
          },
          {
            "text": "कू",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 9,
        "cells": [
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "रें",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "_नि",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "पध",
            "kind": "swara"
          },
          {
            "text": "मप",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "-",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 10,
        "cells": [
          {
            "text": "तु",
            "kind": "lyric"
          },
          {
            "text": "मि",
            "kind": "lyric"
          },
          {
            "text": "हे",
            "kind": "lyric"
          },
          {
            "text": "आ",
            "kind": "lyric"
          },
          {
            "text": "मा",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "प्रा",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "न ॥",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 11,
        "cells": [
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 12,
        "cells": [
          {
            "text": "के",
            "kind": "lyric"
          },
          {
            "text": "ह",
            "kind": "lyric"
          },
          {
            "text": "ब",
            "kind": "lyric"
          },
          {
            "text": "ले",
            "kind": "lyric"
          },
          {
            "text": "तु",
            "kind": "lyric"
          },
          {
            "text": "मि",
            "kind": "lyric"
          },
          {
            "text": "शा",
            "kind": "lyric"
          },
          {
            "text": "ध",
            "kind": "lyric"
          },
          {
            "text": "क",
            "kind": "lyric"
          },
          {
            "text": "प्र",
            "kind": "lyric"
          },
          {
            "text": "धा",
            "kind": "lyric"
          },
          {
            "text": "न",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 13,
        "cells": [
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "रें",
            "kind": "swara"
          },
          {
            "text": "_गं",
            "kind": "swara"
          },
          {
            "text": "रें",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "रें",
            "kind": "swara"
          },
          {
            "text": "_नि",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 14,
        "cells": [
          {
            "text": "के",
            "kind": "lyric"
          },
          {
            "text": "ह",
            "kind": "lyric"
          },
          {
            "text": "दा",
            "kind": "lyric"
          },
          {
            "text": "य",
            "kind": "lyric"
          },
          {
            "text": "तो",
            "kind": "lyric"
          },
          {
            "text": "मा",
            "kind": "lyric"
          },
          {
            "text": "दे",
            "kind": "lyric"
          },
          {
            "text": "ब",
            "kind": "lyric"
          },
          {
            "text": "ता",
            "kind": "lyric"
          },
          {
            "text": "रि",
            "kind": "lyric"
          },
          {
            "text": "मा",
            "kind": "lyric"
          },
          {
            "text": "न",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 15,
        "cells": [
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 16,
        "cells": [
          {
            "text": "गौ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "ब",
            "kind": "lyric"
          },
          {
            "text": "स",
            "kind": "lyric"
          },
          {
            "text": "ब",
            "kind": "lyric"
          },
          {
            "text": "त्या",
            "kind": "lyric"
          },
          {
            "text": "जि",
            "kind": "lyric"
          },
          {
            "text": "ये",
            "kind": "lyric"
          },
          {
            "text": "दि",
            "kind": "lyric"
          },
          {
            "text": "ये",
            "kind": "lyric"
          },
          {
            "text": "छि",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 17,
        "cells": [
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "रें",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "_नि",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "पध",
            "kind": "swara"
          },
          {
            "text": "मप",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "-",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 18,
        "cells": [
          {
            "text": "हृ",
            "kind": "lyric"
          },
          {
            "text": "द",
            "kind": "lyric"
          },
          {
            "text": "ये",
            "kind": "lyric"
          },
          {
            "text": "आ",
            "kind": "lyric"
          },
          {
            "text": "श",
            "kind": "lyric"
          },
          {
            "text": "न",
            "kind": "lyric"
          },
          {
            "text": "दा",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "न ॥",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 19,
        "cells": [
          {
            "text": "सा",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "सा",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 20,
        "cells": [
          {
            "text": "ज",
            "kind": "lyric"
          },
          {
            "text": "बै",
            "kind": "lyric"
          },
          {
            "text": "म",
            "kind": "lyric"
          },
          {
            "text": "ने",
            "kind": "lyric"
          },
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "रे",
            "kind": "lyric"
          },
          {
            "text": "क",
            "kind": "lyric"
          },
          {
            "text": "रु",
            "kind": "lyric"
          },
          {
            "text": "ना",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "छ",
            "kind": "lyric"
          },
          {
            "text": "बि",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 21,
        "cells": [
          {
            "text": "सा",
            "kind": "swara"
          },
          {
            "text": "रे",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "पध",
            "kind": "swara"
          },
          {
            "text": "मप",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "-",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 22,
        "cells": [
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "म",
            "kind": "lyric"
          },
          {
            "text": "दुः",
            "kind": "lyric"
          },
          {
            "text": "खि",
            "kind": "lyric"
          },
          {
            "text": "य",
            "kind": "lyric"
          },
          {
            "text": "मा",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "न",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 23,
        "cells": [
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "नि",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 24,
        "cells": [
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "र",
            "kind": "lyric"
          },
          {
            "text": "पा",
            "kind": "lyric"
          },
          {
            "text": "प",
            "kind": "lyric"
          },
          {
            "text": "ब",
            "kind": "lyric"
          },
          {
            "text": "हि",
            "kind": "lyric"
          },
          {
            "text": "रो",
            "kind": "lyric"
          },
          {
            "text": "ग",
            "kind": "lyric"
          },
          {
            "text": "ज्वा",
            "kind": "lyric"
          },
          {
            "text": "ला",
            "kind": "lyric"
          },
          {
            "text": "श",
            "kind": "lyric"
          },
          {
            "text": "हि",
            "kind": "lyric"
          }
        ]
      }
    ]
  },
  {
    "rows": [
      {
        "kind": "swara",
        "sourceRow": 25,
        "cells": [
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "रें",
            "kind": "swara"
          },
          {
            "text": "सां",
            "kind": "swara"
          },
          {
            "text": "_नि",
            "kind": "swara"
          },
          {
            "text": "ध",
            "kind": "swara"
          },
          {
            "text": "प",
            "kind": "swara"
          },
          {
            "text": "म",
            "kind": "swara"
          },
          {
            "text": "धप",
            "kind": "swara"
          },
          {
            "text": "मप",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          },
          {
            "text": "-",
            "kind": "swara"
          },
          {
            "text": "_ग",
            "kind": "swara"
          }
        ]
      },
      {
        "kind": "lyric",
        "sourceRow": 26,
        "cells": [
          {
            "text": "ता",
            "kind": "lyric"
          },
          {
            "text": "पि",
            "kind": "lyric"
          },
          {
            "text": "ते",
            "kind": "lyric"
          },
          {
            "text": "क",
            "kind": "lyric"
          },
          {
            "text": "रि",
            "kind": "lyric"
          },
          {
            "text": "ले",
            "kind": "lyric"
          },
          {
            "text": "त्रा",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "ऽ",
            "kind": "lyric"
          },
          {
            "text": "न ।",
            "kind": "lyric"
          }
        ]
      }
    ]
  }
]
      },
      {
        id:'abar-bharate',title:'आबार भारते',roman:'Abar Bharate',nativeTitle:'আবার ভারতে',
        language:'Bengali',script:'Devanagari',raga:'Iman Kalyan',taal:'Ektaal',composer:'Swami Premeshananda',singer:null,
        deities:['Sri Ramakrishna'],deityTagSource:'Editorial collection classification',
        aliases:'abar abaar bharate bharot bharat iman imon yaman kalyan ektal ektaal premeshananda premesananda ramakrishna ramkrishna আবার ভারতে ইমন কল্যাণ একতাল স্বামী প্রেমেশানন্দ',
        searchLyrics:'abar bharate bharatir bina e shun gahe madhur tan maran supti magan prane abar kariche chetana dan esho ma bharati',
        groups:[3,3,3,3],marks:['×','2','0','3'],beatsPerCycle:12,source:'https://publications.rkmm.org/svarakusumanjali',
        blocks:[
          block(N(3,'सां सां सां सां सां रें नि नि सां ध ध ध'),L(4,'आ बा र भा र ते भा र ती र वी ना')),
          block(N(5,'मं - मं प नि ध प मं प ग - ग'),L(6,'एय ऽ शु न गा हे म धु र ता ऽ न')),
          block(N(7,'रे ग रे ग म म ग रे ग रे सा सा'),L(8,'म र न शु ऽ भि म ग न प रा ने')),
          block(N(9,'सा रे ग प मं प ग मं प प - प'),L(10,'आ बा र क रि छे चे त ना दा ऽ न॥')),
          block(N(11,'प ध प सां सां सां सां सां सां सां सां सां'),L(12,'ए श मा भा र ती ब र शो र प रे'),L(13,'शु ऽ भ्र आ लो के पु लो कि त क रि')),
          block(N(14,'सां रें रें रें गं गं रें सां निध नि ध प'),L(15,'नि रा न न्द ए इं आँ धा रऽ कु टी रे'),L(16,'नि रा शा ज ड ता ल हु लऽ हु हु रि')),
          block(N(17,'सां - सां सां सां रें नि - सां ध - ध'),L(18,'अ ऽ श्रु श लि ल शि ऽ क्त रि ऽ क्त'),L(19,'ए श मा हृ द य क म ल आ श ने')),
          block(N(20,'प प मं प नि ध प मं प ग - ग'),L(21,'दु रि त पू रि त शो के ते स्ना ऽ न'),L(22,'शौं पि नु च र ने ए म न प्रा ऽ न')),
          block(N(23,'रे ग रे ग म म ग रेग रे सा सा सा'),L(24,'दै ऽ न्य बे द ना आ छेऽ मा गो शु धु'),L(25,'झं ऽ का र र बे झं ऽऽ का रि वी ना')),
          block(N(26,'सा रे ग मं मं प ग मं ध प - ग'),L(27,'पू जा उ प हा र क रि ति दा ऽ ना॥'),L(28,'श ऽ क्ति ते क र अ भ य दा ऽ ना॥'))
        ]
      }
    ]
  };
})();
