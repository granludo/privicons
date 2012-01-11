/*
 * Privicons for Gmail.
 *
 * @see http://privicons.org/
 * @author Imanol Urra (index02@gmail.com)
 *
 */

(function(window, P){
    const SELECTOR_ATTACH_FILE  = 'td.eF>img.ed+span.el[role="link"], td.eF>span.b2+span[role="link"]';

    var behaviours = {};

/********** PRIVICONS PLUGIN BEHAVIOURS **********/

    /** CSS: Inject extension CSS into the page. **/
    behaviours.css = function() {
        P('head').append('<link rel="stylesheet" type="text/css" href="'+ chrome.extension.getURL('css/styles.css') +'" />');
    };

    /** Link: Inject link to Privicons menu. **/
    behaviours.link = function() {
        P(P.document()).bind('DOMSubtreeModified', function() {            
            if ( P(SELECTOR_ATTACH_FILE).length != 0 && P('#privicons-link').length == 0 ) {
                P(SELECTOR_ATTACH_FILE).parent().append('<span id="privicons-link" class="el ou"></span>');

                P.linkDOM = P('#privicons-link');
                P.linkDOM.html('Add Privicon');
                P.linkDOM.attr('role', 'link');
                P.linkDOM.attr('data-privicons-link', 'y');
                P.linkDOM.attr('tabindex', '2');

                //Adding events for Privicons link.
                P.linkDOM.bind('click', function(){
                    P.check();

                    var pos = this.getBoundingClientRect(),
                    x   = pos.left - 1 + P('body').scrollLeft(),
                    y   = pos.top + this.offsetHeight + 2 + P('body').scrollTop();

                    P.menuDOM.css({'left' : x + 'px', 'top' : y + 'px', 'display' : 'block'});
                });

                P.linkDOM.bind('blur', function() {
                    setTimeout(function() {
                        P.menuDOM.hide();
                    }, 200);
                });
            }
        });
    };

    /** Menu: Create Setting Menu & add events for each option. **/
    behaviours.menu = function() {
        var html, style, items = P.getItem();

        html = '<div id="privicons-menu">\
                    <table><tbody>';

        $.each(items, function(key, item) {
            style = 'background-image:url('+ item.img +'); border-left-color:'+ item.clr +';';
            html += '<tr data-privi-key="'+ key +'">\
                        <td>\
                            <div class="icon" style="'+ style +'"></div>\
                        </td>\
                        <td class="txt">['+ item.txt[0] +']</td><td>'+ item.str + '</td>\
                    </tr>';
        });

        html += '</tbody></table></div>';

        P('body').prepend(html);
        P.menuDOM = P('#privicons-menu');

        //Event
        P('tr[data-privi-key]').bind('click', function() {
            var el = P(this),
                key = el.attr('data-privi-key'),
                insertItem = function() {
                    if (key == '2') {
                        P.modal({ type : 'customAfter' });
                    } else {
                        P.insertItem(key);
                    }
                };

            if ( !el.attr('data-selected') ) {
                if ( !P.matching(key) ) {
                    insertItem();
                } else {
                    P.modal({
                        type : 'alert',
                        text : 'This Privicon does not seem to make sense together with your previous selection.',
                        callback : function() {   
                            insertItem();
                        }
                    });
                }
            } else {
                P.removeItem(key);
            }
        });
    };

    /** Modal: Inject a modal window on GMail for advertise about mismatching between items. **/
    behaviours.modal = function () {
        P('body').prepend(P.modalHelper.window);

        P.modalDOM = P('.privicons-modal');
        P.modalDOM.hide();

        P('.privicons-modal-window-header-close, .privicons-modal-button-cancel').bind('click', function() {
            P.modalDOM.hide();
        });

        P('.privicons-modal-mask').css({'top': 0, 'width': P(document).width() +'px'});
        P('.privicons-modal-window').css({'left': (P(document).width() - 600 - 10)/2 +'px', 'width': '600px'});
    };

    /** Parse: Parse every inserted privicon when change from rich editor to plain text editor. **/
    behaviours.parse = function() {
        P(P.document()).on('click', function(e) { 
            var el = P(e.target);
            
            if ( ( el.is('.eo.el') && el.parent().is('.fw') ) || ( el.is('.eo.el, .alb.el') && el.parent().is('.J-J5-Ji.J-Z-I-J6-H') )) 
            {
                P.parser();
            }
        });
    };
    
    /** forwardSecret: Show alert when the user is going to forward with keep secret privicon. **/
    behaviours.forwardSecret = function() {
        P(P.document()).on('mousedown', function(e) { 
            var el    = P(e.target),
                added = P.check();
            
            if ( (el.hasClass('ams') && el.attr('role') == "link" && el.parent().hasClass('amn')) || (el.hasClass('cj') && el.attr('act') == "25") || (el.hasClass('amn') &&  el.parent().hasClass('tMHS5d')) ) 
            {
                if ($.inArray('0', added) != -1 ) {
                    P.modal({
                        type : 'alert',
                        text : "You are going to forward an e-mail with “Keep secret” Privicon. Are you sure?"
                    });
                }
            }
        });
    };
    
    /** forwardReplyParse: Parse and set privicons at top of the email when reply or forward. **/
    behaviours.forwardReplyParse = function() {
        P(P.document()).on('mousedown', function(e) { 
            var el = P(e.target),
                added = P.check(),
                int;
            
            if ( (el.hasClass('ams') && el.attr('role') == "link" && el.parent().hasClass('amn')) || (el.hasClass('cj') && el.attr('act') == '94') || (el.hasClass('cj') && el.attr('act') == '25') || (el.hasClass('amn') &&  el.parent().hasClass('tMHS5d')) || (el.get(0).className.indexOf('hB T-I-J3') >= 0 && el.parent().className == 'T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 T-I-JW T-I-Je T-I-JO') || (el.className == 'T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 T-I-JW T-I-Je T-I-JO' && el.find('img').get(0).className.indexOf('hB T-I-J3') >= 0) ) 
            {
                int = setInterval(function() {
                    if (P('iframe.Am.Al.editable').length != 0) {
                        clearInterval(int);
                        
                        $.each(added, function() {
                            P.insertItem(this.toString());
                        });
                    }
                }, 0);
            }
        });
    };
    
    /** removeAlldeleteButtons: Remove from all delete buttons before sending a email. **/
    behaviours.removeAlldeleteButtons = function() {
        P(P.document()).on({
            mousedown : function(e) {
                var el = P(e.target);
                
                if ( el.parent().get(0).className.indexOf('T-I J-J5-Ji Bq T-I-KE L3') >= 0 || el.get(0).className.indexOf('T-I J-J5-Ji Bq T-I-KE L3') >= 0 || (el.get(0).className.indexOf('T-I J-J5-Ji Bq T-I-ax7 L3') != -1 && el.parent().find('div').index(el) == 0) || (el.parent().get(0).className.indexOf('T-I J-J5-Ji Bq T-I-ax7 L3') != -1 && el.parent().parent().find('div').index(el.parent()) == 0) ) 
                {
                    P.aux = P.removeDeleteButton();
                }
            },
            mouseup   : function(e) {
                var el = P(e.target);
                
                if ( el.parent().get(0).className.indexOf('T-I J-J5-Ji Bq T-I-KE L3') == -1 || el.get(0).className.indexOf('T-I J-J5-Ji Bq T-I-KE L3') == -1 ) 
                {
                    if (P.aux.length != 0) {
                        $.each(P.aux, function() {
                            var key = P(this).attr('data-privi-key');
                              
                            P('div[name="privi-'+ key +'"]:first', P.emailBody().contents()).append(this);
                        });
                        
                        P.deleteButtonEvent();
                        P.aux = [];
                    }
                }
            }
        });
    };
    
    /** handleX: handle deletebuttons on dafts to be able the option to delete a privion . **/
    behaviours.handleX = function() {
        $(window).on('hashchange', function() {
                var delButtons = P('button[name="privicons-button-delete"]', P.emailBody().contents());
                
                $.each(delButtons, function() {
                    var key = P(this).parent().attr('name').split("-")[1];
                    
                    P(this).attr('data-privi-key', key).css({
                        'background': 'transparent url('+ chrome.extension.getURL('icons/delete.png') +')',
                        'position': 'absolute',
                        'right': '5px',
                        'text-indent': '-9999px'
                    });
                });
                
                P.deleteButtonEvent();
        });
    };
    
    $.extend(P.behaviours, behaviours);
})(window, Privicons);