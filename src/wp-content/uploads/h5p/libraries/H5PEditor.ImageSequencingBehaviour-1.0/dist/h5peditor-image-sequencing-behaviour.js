(()=>{"use strict";var e=function(){function e(e,i,n,t){var s=this;this.parent=e,this.field=i,this.params=n,this.setValue=t,this.changes=[],this.passReadies=!0,this.$container=H5P.jQuery("<div>",{class:"h5peditor-imagesequencingbehaviour"}),this.fieldInstance=new H5PEditor.widgets[this.field.type](this.parent,this.field,this.params,this.setValue),this.fieldInstance.appendTo(this.$container),this.children=this.fieldInstance.children,this.fieldInstance.changes&&this.fieldInstance.changes.push((function(){s.handleFieldChange()})),this.$errors=this.$container.find(".h5p-errors"),this.parent.ready((function(){s.handleParentReady()}))}var i=e.prototype;return i.appendTo=function(e){this.$container.appendTo(e)},i.validate=function(){return this.fieldInstance.validate()},i.remove=function(){this.$container.remove()},i.initFieldMaxColumns=function(){this.fieldMaxColumns.field=this.fieldMaxColumns.field||{},this.fieldMaxColumns.field.min=this.fieldMaxColumns.field.min||1,this.fieldMaxColumns.field.max=Math.max(this.fieldMaxColumns.field.min,(this.listSequenceImages.getValue()||[]).length)},i.setFieldMaxColumnsMax=function(e){this.fieldMaxColumns.field.max=Math.max(this.fieldMaxColumns.field.min,e)},i.findSequenceImages=function(e){return e.children&&e.children.filter((function(e){return e instanceof H5PEditor.List&&0===e.getId().indexOf("field-sequenceimages")})).shift()||!1},i.handleFieldChange=function(){var e=this;this.params=this.fieldInstance.params,this.changes.forEach((function(i){i(e.params)}))},i.handleParentReady=function(){var e=this;this.listSequenceImages=this.findSequenceImages(this.parent),this.fieldEnforceColumns=H5PEditor.findField("behaviour/enforceColumns",this.parent),this.fieldMaxColumns=H5PEditor.findField("behaviour/maxColumns",this.parent),this.fieldEnforceColumns&&this.fieldMaxColumns&&this.listSequenceImages&&(this.initFieldMaxColumns(),this.listSequenceImages.on("addedItem",(function(){e.handleListSequenceImagesChanged(),e.handleFieldMaxColumnsChanged()})),this.listSequenceImages.on("removedItem",(function(){e.handleListSequenceImagesChanged(),e.fieldMaxColumns.$input.val((e.listSequenceImages.getValue()||[]).length),e.fieldMaxColumns.$input.change()})),this.fieldEnforceColumns.changes.push((function(i){e.handleFieldEnforceColumnsChanged(i)})),this.fieldMaxColumns.$input.on("change",(function(){e.handleFieldMaxColumnsChanged()})))},i.handleListSequenceImagesChanged=function(){this.setFieldMaxColumnsMax((this.listSequenceImages.getValue()||[]).length)},i.handleFieldEnforceColumnsChanged=function(e){this.fieldMaxColumns.$input.change(),e&&(this.fieldMaxColumns.$errors.html().length>0||void 0===this.fieldMaxColumns.value&&this.fieldMaxColumns.$errors.html("<p>".concat(H5PEditor.t("H5PEditor.ImageSequencingBehaviour","maxColumnsRequired"),"</p>")))},i.handleFieldMaxColumnsChanged=function(){this.fieldMaxColumns.$input.val()>this.fieldMaxColumns.field.max&&this.fieldMaxColumns.$errors.html("<p>".concat(H5PEditor.t("H5PEditor.ImageSequencingBehaviour","maxColumnsExceeded"),"</p>"))},e}();H5PEditor=H5PEditor||{},H5PEditor.widgets.imagesequencingbehaviour=e})();