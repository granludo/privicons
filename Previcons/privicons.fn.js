/*
 * Privicons for Gmail.
 *
 * @see http://privicons.org/
 * @author Imanol Urra (index02@gmail.com)
 *
 */

/********** PRIVICONS PLUGIN FUNCTIONS **********/
(function(window, P) {
    var fn = {};
    
    /** getItem: return specified item or all items. **/
    fn.getItem = function(key) {
        if (!key) return P.items;
        return P.items[key];
    };

    /** insertItem: insert item into email. **/
    fn.insertItem = function(val) {
        var key = typeof val == 'string' ? val : val.key,
            subject = P.emailSubject.get(), body = P.emailBody.get(), is = P.emailBody(),
            signature, email, nEmail,
            oItem   = P.getItem(key),
            item    = {
                clr : oItem.clr,
                txt : val.txt ? val.txt : oItem.txt[0],
                str : val.str ? val.str : oItem.str,
                img : oItem.img,
                des : val.des ? val.des : oItem.des,
                url : oItem.url
            };

        //set subject
        P.emailSubject.set('['+ item.txt +'] '+ subject);

        //process email
        if (is.area == 'rich') {
            nEmail  = P.priviconsTags(is.area, key, item).top;
            nEmail += body;
            //nEmail += ( P.addedPrivicons.length == 0 ) ? "<br>" : "";
            nEmail += P.priviconsTags(is.area, key, item).bottom;
        } else {
            nEmail  = P.priviconsTags(is.area, key, item).top;
            nEmail += body;
            nEmail += ( P.addedPrivicons.length == 0 ) ? "\n" : "";
            nEmail += P.priviconsTags(is.area, key, item).bottom;
            nEmail += "\n";
        }
        
        P.emailBody.set(nEmail);
         
        P.deleteButtonEvent();
    };

    /** removeItem: remove item from email. **/
    fn.removeItem = function(val) {
        var key = typeof val == 'string' ? val : val.key,
            oItem   = fn.getItem(key),
            item    = {
                clr : oItem.clr,
                txt : val.txt ? val.txt : oItem.txt[0],
                str : val.str ? val.str : oItem.str,
                img : oItem.img,
                des : val.des ? val.des : oItem.des,
                url : oItem.url
            },
            subject = P.emailSubject.get(), body = P.emailBody.get(), is = P.emailBody()
            aux = '';

        //remove item from subject
        P.emailSubject.set( subject.replace('['+ item.txt +'] ', "") );

        //remove item from email body
        if (is.area == 'rich') {
            is.contents().find('div[name="privi-'+ key +'"]').remove();
        } else {
            aux = '['+ item.txt +'] '+ item.str +'\n';
            body = body.replace(aux, "");

            aux = '\n['+ item.txt +'] '+ item.str +': '+ item.des +' (more info: '+ item.url +')';
            body = body.replace(aux, "");

            P.emailBody.set(body);
        }
    }

    /** Check: Check wich privicon is added on composed/draft email and return the privicons keys in an array. **/
    fn.check = function() {
        var items = fn.getItem(), is = P.emailBody(), body = escape( P.emailBody.get() ), el;

        for (key in items) {
            if (is.area == 'rich') {
                if (is.contents().find('div[name="privi-'+ key +'"]').length != 0) {
                    el = P.menuDOM.find('tr[data-privi-key="'+ key +'"]');
                    el.attr('data-selected', 'selected');
                    
                    if ( $.inArray(key, P.addedPrivicons) == -1) P.addedPrivicons.push(key);
                } else {
                    el = P.menuDOM.find('tr[data-privi-key="'+ key +'"]');
                    if (el) {
                        el.removeAttr('data-selected');

                        if ( $.inArray(key, P.addedPrivicons) >= 0 ) {
                            P.addedPrivicons.splice( $.inArray(key, P.addedPrivicons), 1 );
                        }
                    }
                }
            } else {

                if ( body.match( escape( '['+ items[key].txt[0]) ) ) {
                    el = P.menuDOM.find('tr[data-privi-key="'+ key +'"]');
                    el.attr('data-selected', 'selected');
                    if ( $.inArray(key, P.addedPrivicons) == -1) P.addedPrivicons.push(key);
                } else {
                    el = P.menuDOM.find('tr[data-privi-key="'+ key +'"]');
                    if (el) {
                        el.removeAttr('data-selected');

                        if ( $.inArray(key, P.addedPrivicons) >= 0 ) {
                            P.addedPrivicons.splice( $.inArray(key, P.addedPrivicons), 1 );
                        }
                    }
                }
            }
        }
        
        return P.addedPrivicons;
    };

    /** Matching: search if the key mismatch with other inserted item **/
    fn.matching = function(key) {
        if (P.addedPrivicons.length == 0) return false;

        var mpr, match = false;

        $.each(P.addedPrivicons, function() {
            mpr = fn.getItem(this).mpr;
            
            if ( $.inArray(key, mpr) >= 0 ) match = true;
        });

        return match ? true : false;
    };

    /** Modal: Show modal with specified parameters **/
    fn.modal = function(modalObj) {
        var obj = modalObj || null;

        if (!obj) return;

        P('.privicons-modal-mask').height( P(P.document()).height() +'px' );
        P('.privicons-modal-window').css({'top' : (P('body').scrollTop() + 143) +'px'});
        P('.privicons-modal-window-header-text').html(P.modalHelper[obj.type].head);

        if (obj.type == 'alert') {
            P('.privicons-modal-window-body-content').html(P.modalHelper[obj.type].body).find('div').html(obj.text);
        } else {
            P('.privicons-modal-window-body-content').html(P.modalHelper[obj.type].body);
            P('.privicons-modal-window-body-content').find('#date').glDatePicker({
                startDate: new Date(),
                allowOld: false
            });
        }

        P('.privicons-modal-button-custom').html(P.modalHelper[obj.type].button.txt).unbind('click').bind('click', function() {
            P.modalHelper[obj.type].button.action(P.modalDOM, obj.callback);
        });

        P.modalDOM.show();
    };
    
    /** parser: Parse a email body when it change from rich mode to text mode and vice versa. **/
    fn.parser = function() {
        var items = fn.getItem(),
            is = P.emailBody(), subject = P.emailSubject.get(), body = P.emailBody.get(),
            matches = [], matchItems = [];

        //Think that always is plain text, then detect text, delete, and insert again.
        //split
        body = ( is.area == 'plain' ) ? body.split('\n') : body.split('<br>');
        
        //match
        $.each(items, function(key, item) {
            $.each(body, function(i, val){
                if ( (val.indexOf('['+ item.txt[0]) >= 0) || (val.indexOf('['+ item.txt[1]) >= 0) ) {
                    matches.push(i);

                    if ( key == '2' ) {
                        var _aux = val.split('] '),
                            txt = _aux[0].slice(1),
                            str = _aux[1].split(' (');
                        
                        key = {
                            key : '2',
                            txt : txt,
                            str : str[0],
                            img : item.img,
                            des : 'The "'+ str[0] +'" Privicon asks the Receiving User to delete the e-mail message no later than a specified period.'
                        };
                    }

                    if ($.inArray(key, matchItems) == -1) matchItems.push(key);
                }
            });
        });

        //remove
        matches.sort();
        $.each(matches, function(i, v) {
            body.splice(v, 1);
            $.each(matches, function(i, v) { matches[i] -= 1; }); 
        });

        //join
        body = ( is.area == 'plain' ) ? body.join('\n') : body.join('<br>');

        //replace subject & body
        P.emailSubject.set('');
        P.emailBody.set(body);

        //on finish with parse, insert items again
        $.each(matchItems, function(i, mKey) {
            fn.insertItem(mKey);
        });
    }
    
    /** removeDeleteButton: remove delete button an return this buttons if after there is intention to insert it again. **/
    fn.removeDeleteButton = function(key) {
        var context  = P.emailBody().contents(),
            selector = 'button[name="privicons-button-delete"]',
            clone    = P(selector, context).clone().toArray();

        P(selector, context).remove();
        
        return clone;
    };

    $.extend(P, fn);
})(window, Privicons);