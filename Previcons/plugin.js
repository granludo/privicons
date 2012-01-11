/*
 * Privicons for Gmail.
 *
 * @see http://privicons.org/
 * @author Imanol Urra (index02@gmail.com)
 *
 */

/********** PRIVICONS INIT **********/
(function(window, P){
    P.ready(function() {
        for (x in P.behaviours) P.behaviours[x]();
    });
    
    P.printReady(function(evt) {
        P('head').append('<link rel="stylesheet" type="text/css" href="'+ chrome.extension.getURL('css/styles.css') +'" />');
        
        if ( P('div[name="privi-1"]').length > 0 ) {
            P.behaviours.modal();
                        
            P.modal({
                type : 'alert',
                text : "You are going to print an e-mail with \"Don't print\" Privicon. Are you sure?",
                callback : function() {
                	P.modalDOM.hide();
                   	setTimeout(function() {
                   		evt();
                   	}, 50);
               	}
            });
        } else {
        	evt();
        }
    });
})(window, Privicons);