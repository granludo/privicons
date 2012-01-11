/*
 * Privicons for Gmail.
 *
 * @see http://privicons.org/
 * @author Imanol Urra (index02@gmail.com)
 *
 */

/********** PRIVICONS PLUGIN CORE **********/
(function (window){
    var Privicons = (function() {
        var   document 	    = window.document,
        	  Privicons, 
              printDocument = false;
            
        const EDIT_AREA 	= 'iframe.editable',
              EDIT_TEXTAREA = 'textarea[name="body"]';
        
        Privicons = function(selector, context) {
        	context = context || document;
        	
        	return $(selector, context); 
        };
        
        Privicons.document    = function() { 
        	return document || $('#canvas_frame').contents(); 
        };
        
        Privicons.ready       = function(callback) {
            var int;
            $('#canvas_frame').contents().ready(function() {
                document = $('#canvas_frame').contents();
                
                int = setInterval(function() {
                    if (printDocument) clearInterval(int);
                    //We suppose that Gmail is not loaded until the Archive button is loaded.
                    if ( P('.nM[role="navigation"]').length > 0 ) {
                        clearInterval(int);
                        
                        callback();
                    }
                }, 0);
            });
        };
        
        Privicons.printReady  = function(callback) {
            if ( document.location.search.indexOf('view=pt') >= 0 ) {
            	printDocument = true;
            	console.log('print');
            	var bodyOnLoad = document.body.onload;
            	document.body.onload = function() {
            		document = window.document;
            		callback(bodyOnLoad);
            	};              
                //callback();
            }
        };
        
        Privicons.emailSubject = {
            get : function() { return P('input[name="subject"]').val(); },
            set : function(value) { P('input[name="subject"]').val(value); }
        };
        
        Privicons.emailBody    = function() {
        	var _return;
            if (P(EDIT_AREA).parent().is(':visible')) {
            	_return = P(EDIT_AREA);
                _return.area = 'rich';
            } else {
                _return = P(EDIT_TEXTAREA);
                _return.area = 'plain'; 
            }
                
            return _return;
        };
        
        Privicons.emailBody.get = function() {
            if ( P(EDIT_AREA).parent().is(':visible') ) return P(EDIT_AREA).contents().find('body').html();
           	return P(EDIT_TEXTAREA).val();
        };
        Privicons.emailBody.set = function(value) {
            if (P(EDIT_AREA).parent().is(':visible')) return P(EDIT_AREA).contents().find('body').html(value);
            return P(EDIT_TEXTAREA).val(value);
        };
        
        $.extend(Privicons, { behaviours: {}, linkDOM: false, menuDOM: false, modalDOM: false, addedPrivicons: [], aux: [] })
           
        return Privicons;
    })();
    
    window.Privicons = window.P = Privicons;
})(window);