if(document.querySelectorAll('.js-mask').length) {
  document.querySelectorAll('.js-mask').forEach(e=>{
    IMask(e,{
      mask: '+{7}(000)000-00-00'
    })
  })
}
