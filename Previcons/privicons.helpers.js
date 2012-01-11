/*
 * Privicons for Gmail.
 *
 * @see http://privicons.org/
 * @author Imanol Urra (index02@gmail.com)
 *
 */

/********** PRIVICONS PLUGIN HELPERS **********/
(function(window, P) {
    P.items = {
        '0' : {
            'clr' : '#CC3333',
            'txt' : ['X'],
            'str' : 'Keep private',
            'img' : 'http://privicons.org/files/gimgs/keep-secret.png',
            'des' : "The “Keep private” Privicon asks the Receiving User to keep the received e-mail message private.",
            'url' : 'http://privicons.org/projects/icons/#keep-private',
            'mpr' : ['3', '4', '5']
        },
        '1' : {
            'clr' : '#FF3333',
            'txt' : ['/'],
            'str' : 'Don’t print',
            'img' : 'http://privicons.org/files/gimgs/dont-print.png',
            'des' : 'The “Don’t print” Privicon asks the Receiving User to not print the received e-mail message.',
            'url' : 'http://privicons.org/projects/icons/#dont-print',
            'mpr' : []
        },
        '2' : {
            'clr' : '#FF6633',
            'txt' : ['='],
            'str' : 'Delete after reading/X days',
            'img' : 'http://privicons.org/files/gimgs/delete-after.png',
            'des' : 'The “Delete after reading/X days” Privicon asks the Receiving User to delete the e-mail message no later than a specified period.',
            'url' : 'http://privicons.org/projects/icons/#delete-after',
            'mpr' : ['5']
        },
        '3' : {
            'clr' : '#000000',
            'txt' : ['-'],
            'str' : 'Don’t attribute (Anonymous)',
            'img' : 'http://privicons.org/files/gimgs/dont-attribute.png',
            'des' : 'The “No attribution” Privicon asks the Receiving User to not attribute, name or mention the original Sending User of the e-mail message in any kind.',
            'url' : 'http://privicons.org/projects/icons/#dont-attribute',
            'mpr' : ['0']
        },
        '4' : {
            'clr' : '#FFCC33',
            'txt' : ['o'],
            'str' : 'Keep internal',
            'img' : 'http://privicons.org/files/gimgs/keep-internal.png',
            'des' : 'The “Keep internal” Privicon asks the Receiving User to present this e-mail message only to those people that are common friends, or otherwise part of a group of people are in a relation to both the Sending User and the Receiving User.',
            'url' : 'http://privicons.org/projects/icons/#keep-internal',
            'mpr' : ['0', '1', '2', '5']
        },
        '5': {
            'clr' : '#99CC66',
            'txt' : ['>','&gt;'],
            'str' : 'Please share',
            'img' : 'http://privicons.org/files/gimgs/please-share.png',
            'des' : 'The “Please share” Privicon asks the Receiving User to share this e-mail message with everyone, as she likes.',
            'url' : 'http://privicons.org/projects/icons/#please-share',
            'mpr' : ['0', '2', '4']
        }
    };
    
    //InsertKey HTML
    P.priviconsTags = function(type, key, item){
        var styleH  = 'padding:2px; margin: 5px 0; height:20px;\
                       font-family:droid-sans-mono-1,droid-sans-mono-2,arial, sans-serif; font-size:12px; color:#777;',
            styleF  = 'font-family:droid-sans-mono-1,droid-sans-mono-2,arial, sans-serif; font-size:11px; color:#777;',
            html = {
                top : '<div name="privi-'+ key +'" title="'+ item.des +'" style="'+ styleH +' border-bottom: solid 3px '+ item.clr +'; position: relative;">\
                        <img src="'+ item.img +'" alt="'+ item.txt +'" style="float:left; margin-right: 5px;"/>\
                        <span style="line-height: 20px;">['+ item.txt +'] '+ item.str +' \
                            (<a href="'+ item.url +'" target="_blank" name="privi-info">?</a>)\
                        </span> \
                        <button name="privicons-button-delete" data-privi-key="'+ key +'" style="background: transparent url('+ chrome.extension.getURL('icons/delete.png') +'); position: absolute; right: 5px; border: 0; text-indent: -9999px; width: 16px;">X</button>\
                    </div>',
                bottom : '<div name="privi-'+ key +'" style="'+ styleF +'">\
                            ['+ item.txt +'] '+ item.str +': '+ item.des +' \
                            (<a href="'+ item.url +'" target="_blank" name="privi-info">more info...</a>)\
                          </div>'
            },
            text = {
                top : '['+ item.txt +'] '+ item.str +'\n',
                bottom : '['+ item.txt +'] '+ item.str +': '+ item.des +' (more info: '+ item.url +')'
            }
            
        return ( type == 'rich') ? html : text;
    };
    
    P.modalHelper = {
        window : '<div class="privicons-modal" role="dialog" tabindex="0">\
                    <div class="privicons-modal-mask" style="opacity: 0.5;"></div>\
                        <div class="privicons-modal-window Kj-JD NA">\
                        <div class="privicons-modal-window-header">\
                            <span class="privicons-modal-window-header-text"></span>\
                            <span class="privicons-modal-window-header-close Kj-JD-K7-Jq"></span>\
                        </div>\
                        <div class="privicons-modal-window-body">\
                            <div class="privicons-modal-window-body-content"></div>\
                            <div class="privicons-modal-window-body-buttons">\
                                <button class="privicons-modal-button-custom"></button>\
                                <button class="privicons-modal-button-cancel">Cancel</button>\
                            </div>\
                        </div>\
                        <div class=""></div>\
                        <span tabindex="0"></span>\
                    </div>\
                  </div>',
        alert : {
            head : 'Privicons - Alert',
            body : '<img src="'+ chrome.extension.getURL('icons/alert.png') +'" alt="Alert" style="float: left; margin-right: 10px"/>\
                    <div></div>',
            button : {
                txt    : 'Do it anyway',
                action : function(modal, callback) {
                    P.modalDOM.hide();
                    if (callback) callback();
                }
            }
        },
        customAfter : {
            head : 'Privicons - Custom "Delete after reading/X days"',
            body : '<div id="privicons-custom-after"><div>\
                        <span>Default value</span>\
                        <select>\
                        <option value="">Delete after reading</option>\
                        <option value="1">Delete after 1 day</option>\
                        <option value="3">Delete after 3 days</option>\
                        <option value="7">Delete after 1 week</option>\
                        </select>\
                    </div>\
                    <div>- or -</div>\
                    <div>\
                        <span>Custom value</span>\
                        <input id="date" type="text" placeholder="Number of days or specific date in MM/DD/YYYY format" />\
                    </div></div>',
            button : {
                txt    : 'Insert',
                action : function(modal) {
                    var select = P('#privicons-custom-after select'),
                        input  = P('#privicons-custom-after input'),
                        insObj,
                        _str, _des, _txt;
                    
                    if (input.val()) {
                        if (input.val().match("/")) {
                            _str = 'Delete after '+ input.val();
                        } else {
                            _str = 'Delete after '+ input.val() +' days';
                        }
                                
                        _txt = input.val();
                    } else {
                        _str = select.find(':selected').text();
                        _txt = select.find(':selected').val();
                    }
                            
                    insObj = {
                        key : '2',
                        txt : '='+ _txt,
                        str : _str,
                        img : 'http://privicons.org/files/gimgs/delete-after.png',
                        des : 'The "'+ _str +'" Privicon asks the Receiving User to delete the e-mail message no later than a specified period.'                            
                    };
                            
                    P.insertItem(insObj);
                            
                   	modal.hide();
                }
            }
        }
    };
    
    P.deleteButtonEvent = function() {
        P(P.emailBody().contents()).on('click', 'button[name="privicons-button-delete"]', function() {
            P.removeItem(P(this).attr('data-privi-key'));
        });
    }; 
})(window, Privicons);