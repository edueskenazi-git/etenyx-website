(function () {
  var lang = (navigator.language || 'pt').toLowerCase();
  var dest = 'pt/';
  if (lang.indexOf('en') === 0) dest = 'en/';
  else if (lang.indexOf('es') === 0) dest = 'es/';
  window.location.replace(dest);
})();
