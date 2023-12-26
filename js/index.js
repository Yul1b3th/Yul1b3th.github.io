const bodyHidden = document.querySelector( 'body' );
const nav = document.querySelector( '#container-menu' );
const navToggle = document.querySelector( '#btn-menu' );
const navLinks = document.querySelectorAll( '#menu a' );

navToggle.addEventListener( 'click', () => {
 bodyHidden.classList.toggle( 'overflow-hidden' );
 const visibility = nav.getAttribute( "data-visible" );
 if ( visibility === "false" ) {
  nav.setAttribute( "data-visible", true );
  navToggle.setAttribute( "aria-expanded", true );
 } else {
  nav.setAttribute( "data-visible", false );
  navToggle.setAttribute( "aria-expanded", false );
 }
} );

navLinks.forEach( link => {
 link.addEventListener( 'click', () => {
  navLinks.forEach( otherLink => otherLink.classList.remove( 'active' ) );

  link.classList.add( 'active' );
  bodyHidden.classList.remove( 'overflow-hidden' );
  nav.setAttribute( "data-visible", false );
  navToggle.setAttribute( "aria-expanded", false );
 } );
} );
