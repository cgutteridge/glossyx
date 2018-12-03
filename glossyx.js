/* glossyx.js by Christopher Gutteridge 
   https://github.com/cgutteridge/??/
   Apache License
*/
jQuery(document).ready(function(){
   var glosses = [
      window.location.origin+"/demonstration-glossary/"
   ];

   var context = jQuery( ".hentry");

   var terms = {};
   var todo = glosses.length;
   //context.css( 'background-color','green').css('border','solid 10px red');
   for( let i=0; i<glosses.length; ++i ) {
      jQuery.ajax( {
         url: glosses[i]
      }).done((msg)=>{
         var dagloss = jQuery(jQuery.parseHTML(msg));
         var entries = dagloss.find( '.hentry ul li a' );
         entries.each( (n,e) => { 
            e=jQuery(e); 
            if( e.attr( 'href' ) ) { 
               var link = e.attr('href');
               var term = e.text().trim();
               if( !terms[term] ) { terms[term] = []; }
               terms[term]= { link: link, exp: new RegExp('\\b'+term+'\\b','i')};
            }
         });
      }).always(()=>{
         todo--;
         if( todo == 0 ) {
            console.log( 'loaded glossary terms', terms );
            context.each( (i,e) => {
               applyTerms( e, terms );
            });
         }
      });
   }

   function findTextNodes( element ) {
      if( element.nodeName == 'header' ) { return  []; }
      if( element.nodeName == 'footer' ) { return  []; }
      if( element.nodeName == '#text' ) { return  [ element ]; }
      if (!element.hasChildNodes()) { return []; }

      let list = []; 
      let children = element.childNodes;
      for (let i = 0; i < children.length; i++) {
         let list2 = findTextNodes( children[i] );
         for( let j = 0; j<list2.length; ++j ) {
            list.push( list2[j] );
         }
      }
      return list;
   }


   function applyTerms( element, terms ) {
      let texts = findTextNodes( element );

      let termk = Object.keys( terms );
      for( let i=0; i<texts.length;++i ) {
         let targetText = texts[i];
         if( targetText.textContent.trim() == "" ) { continue; }
         let hasMatches = true;
         while( hasMatches ) {
            hasMatches = false;
            for( let j=0; j<termk.length; ++j ) {
               let term = terms[termk[j]];
               if( !term.exp.test(targetText.textContent)) { continue; }
               hasMatches = true;
               let list = targetText.textContent.split( term.exp, 2 );
               // we need to grab the actual text of how it is in the article for in a mo
               var m =  targetText.textContent.match( term.exp );
      

               // trim targetText to just be the stuff up to the term
               targetText.textContent = list[0];
 
               // we could add highlights to gloss terms here
               let matchEl = document.createElement( 'span' );
               matchEl.setAttribute( 'data-gloss-term', termk[j] );
               matchEl.appendChild( document.createTextNode( m[0] ));
               if( targetText.nextSibling ) {
                  targetText.parentNode.insertBefore( targetText.nextSibling, matchEl );
               } else {
                  targetText.parentNode.appendChild( matchEl );
               } 

               // add the gloss marker. This needs to be fancier and if the URL is local to the blog
               // it could grab the page as a popup or embedded thing.

               let glossmarker = document.createElement( 'span' );
               if( matchEl.nextSibling ) {
                  matchEl.parentNode.insertBefore( matchEl.nextSibling, glossmarker );
               } else {
                  matchEl.parentNode.appendChild( glossmarker );
               } 
               // back to jquery, thank goodness
               jQuery(glossmarker)
                  .css('cursor','pointer')
                  .addClass('ultralink-ignore')
                  .text('⋮')
                  .attr('title','Glossary: '+termk[j] )
                  .click(()=>{ window.open( term.link, "_blank" ); } );

               // add remaining text if any, and queue it for glossing
               if( list.length == 2 ) {
                  let rest = document.createTextNode( list[1] );
                  if( glossmarker.nextSibling ) {
                     glossmarker.parentNode.insertBefore( glossmarker.nextSibling, rest );
                  } else {
                     glossmarker.parentNode.appendChild( rest );
                  } 
                  texts.push( rest );
               }
            }
         }
         let text = texts[i].textContent;
      }
   }

});
