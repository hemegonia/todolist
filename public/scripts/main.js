var query = document.body.querySelectorAll('button.edit, h2.edit');

var changeToInput = function() {
   var parent = this.parentElement;
   var href = this.getAttribute('data-href');
   var id = this.getAttribute('data-id');

   var inputHTML =
      '<form class="ui form" action="' +
      href +
      '" method="POST" ><div class="field"><input type="text" name="title" id="' +
      id +
      '-edit" value="' +
      this.innerText +
      '"></div></form >';
   parent.innerHTML = inputHTML;
   var input = document.getElementById(id + '-edit');
   input.focus();
   input.setSelectionRange(0, input.value.length);
   input.addEventListener('focusout', function() {
      input.parentElement.parentElement.submit();
   });
};

query.forEach(function(button) {
   button.addEventListener('click', changeToInput);
});
