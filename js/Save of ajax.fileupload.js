/**
* options: 	onComplete 	: function called when file upload is finished
						onStart			:	function called when file upload start
						multiple		:	bool that add a new ajax fileupload when submitting a file
						loadingText : text shown when uploading a file (%name% shows the filename)
						finishText : text shown when uploading a file (%name% shows the filename)
*/
Ajax.FileUpload = Class.create();
Ajax.FileUpload.options = Array();
Ajax.FileUpload.prototype =
{
  initialize: function(element, url, options) {
		console.debug('initialize');
    this.url = url;
    this.element = element = $(element);
		this.options = Ajax.FileUpload.defaultOptions;
		if (options)
			this.options = Object.extend(this.options, options);
		this.createInstance();
  },
  createInstance: function() {
		this.id = Math.ceil(Math.random() * 99999);
		console.debug('createInstance #'+this.id);
    Ajax.FileUpload.options[this.id] = this.options;
    
    this.createInfo();
    this.createMyIframe();
    this.createMyForm();
		Ajax.FileUpload.updateInfo(this.id);
    return (this.id);
  },
  createInfo:	function () {
  	if ($('ajaxfileupload_infos') == null)
    {
			console.debug('info created #'+this.id);
			myinfo = document.createElement('div');
			myinfo.id = "ajaxfileupload_infos";
			this.element.appendChild(myinfo);
    }
    else
    {
			console.debug('info getted #'+this.id);
			myinfo = $('ajaxfileupload_infos');
		}
		this.info = myinfo;
  },
  createMyIframe:	function () {
		if ($('ajaxfileupload_iframe_'+this.id) == null)
    {
			myspan = document.createElement('span');
			myiframe = document.createElement('iframe');
			myiframe.id = 'ajaxfileupload_iframe_'+this.id;
			myiframe.src = 'about:blank';
			myiframe.name = 'ajaxfileupload_iframe_'+this.id;
			myiframe.style.display = 'none';
			myiframe.appendChild(myspan);
			this.element.appendChild(myiframe);
		}
  },
  createMyForm: function () {
		if ($('ajaxfileupload_form_'+this.id) == null)
    {
			myform = document.createElement('form');
			myform.method = 'POST';
			myform.action = this.url;
			myform.target = 'ajaxfileupload_iframe_'+this.id;
			myform.id = 'ajaxfileupload_form_'+this.id;
			myform.className = "ajaxfileupload_form";
			myform.enctype = 'multipart/form-data';
				 
			myfile = document.createElement('input');
			myfile.type='file';
			myfile.name='file';
			myfile.className='ajaxfileupload_file';
			myfile.id = 'ajaxfileupload_file_'+this.id;
			this.setOnStart(myfile);	
			myform.appendChild(myfile);
			this.element.appendChild(myform);
		}
  },
  setOnStart: function (myfile) {
		console.debug('setOnStart #'+this.id);
		myfile.onchange = function ()
		{
			var id = Ajax.FileUpload.getId(this.parentNode.id);
			Ajax.FileUpload.onStart(id);
			$('ajaxfileupload_iframe_'+id).onload = function () {
				if (typeof(Ajax.FileUpload.options[id].onComplete) == "function")
					Ajax.FileUpload.doFunction(Ajax.FileUpload.options[id].onComplete);
			}
			if (typeof(Ajax.FileUpload.options[id].onStart) == "function")
					Ajax.FileUpload.doFunction(Ajax.FileUpload.options[id].onStart);
			this.parentNode.submit();
			this.parentNode.style.display = 'none';
			Ajax.FileUpload.updateInfo(id, Ajax.FileUpload.defaultOptions.loadingText);
			if (Ajax.FileUpload.options[id].multiple == true)
			{
				console.debug("found multiple upload");
				this.createInstance();
			}
		}
  }
}

Ajax.FileUpload.getId = function(id) {
  var		regexp = /^\w+_(\d+)$/;

  if (found = regexp.exec(id)) {
    return(Number(found[1]));
  }
  return(false);
}

Ajax.FileUpload.onStart = function(id) {
	console.debug('onStart called #'+id);
	$('ajaxfileupload_form_'+id).style.display = 'none';
	$('ajaxfileupload_form_'+id)
}

Ajax.FileUpload.onComplete = function(id) {
	console.debug('onComplete called #'+id);
}

Ajax.FileUpload.basename = function(path, suffix) {
    var b = path.replace(/^.*[\/\\]/g, '');
    if (typeof(suffix) == 'string' && b.substr(-suffix.length) == suffix) {
        b = b.substr(0, b.length-suffix.length);
    }
    return b;
  }
  
Ajax.FileUpload.doFunction = function (func) {
  if (typeof(func) == "function")
    func();
}

Ajax.FileUpload.updateInfo = function (id, body) {
	if ($('ajaxfileupload_div_'+id) == null)
	{
		mydiv = document.createElement('div');
		mydiv.id = 'ajaxfileupload_div_'+id;
		mydiv.className = "ajaxfileupload_div";
		mydiv.style.display = "none";
		$('ajaxfileupload_infos').appendChild(mydiv);
	}
	else
	{
		mydiv = $('ajaxfileupload_div_'+id);
		mydiv.style.display = "block";
		text = body;
		if ($('ajaxfileupload_file_'+id) != null)
		{
			text = body.replace("%name%", Ajax.FileUpload.basename($('ajaxfileupload_file_'+id).value));
		}
		mydiv.innerHTML = text;
	}
}

Ajax.FileUpload.defaultOptions = {
	loadingText: 'Uploading %name%',
	finishText: '%name% uploaded !',
	multiple:true
}