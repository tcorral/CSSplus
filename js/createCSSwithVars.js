(function(global)
{
	function removeEnter(sText)
	{
		return sText.replace(/\r\n/g,"");
	}
	function makeAjaxCall(sHref)
	{
		jQuery.ajax({
			type: "GET",
			url: sHref,
			dataType: "text",
			success: function(sCssText)
			{
				var oCssWithVars = new CssWithVars();
				sCssText = removeEnter(sCssText);
				oCssWithVars.create(sCssText);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown)
			{
				throw new Error("Maybe ther is a problem with the conection");
			}
		});
	}
	function getLinkHref(oLink)
	{
		return oLink.href + "";
	}
	function checkLinkMediaType(oLink, sMediaType)
	{
		var sMediaText = '';
		if(typeof oLink.media == "string"){
			sMediaText = oLink.media;
		}else{
			sMediaText = oLink.media.mediaText;
		}
		return sMediaText === sMediaType;
	}
	function getLinksByMediaType(sMediaType)
	{
		var cLinks = document.getElementsByTagName("link");
		var nLink = 0;
		var nLenLinks = cLinks.length;
		var aAux = [];
		var oLink = 0;

		for(; nLink < nLenLinks; nLink++)
		{
			oLink = cLinks[nLink];
			if(checkLinkMediaType(oLink, sMediaType))
			{
				aAux.push(oLink);
			}
		}
		return aAux;
	}
	var CssWithVars = function()
	{
		this.sText = '';
		this.aMatchedVarsInCss = [];
		this.onCreate = function(sText)
		{
			$(document.body).append("<style type='text/css'>" + sText + "</style>");
		};
	};
	CssWithVars.prototype.setText = function(sText)
	{
		this.sText = (sText + '').replace(/ +(?= )/g, '');
		return this;
	};
	CssWithVars.prototype.setCssWithVars = function(sCssWithVars)
	{
		this.sCssWithVars = sCssWithVars;
		return this;
	};
	CssWithVars.prototype.cleanAndMinimizeCode = function()
	{
		return this.sText.replace(/\t/g, '').replace(/\r/g, '').replace(/\n/g, '').replace(/ +(?= )/g, '');
	};
	CssWithVars.prototype.create = function(sText)
	{
		this.sText = sText;
		if(this.checkForVars())
		{
			this.getCSS();
		}
		this.onCreate(this.sText);
		return this.cleanAndMinimizeCode(this.sText);
	};
	CssWithVars.prototype.checkForVars = function()
	{
		var aVarsInCss = this.sText.match(/\[\S*\]/g);
		if(aVarsInCss !== null)
		{
			this.aMatchedVarsInCss = jQuery.uniqueValues(aVarsInCss);
			return true;
		}
		return false;
	};
	CssWithVars.prototype.getCSS = function()
	{
		var sText = this.sText;
		var nMatched = 0;
		var nLenMatches = 0;
		var oMatch = null;
		if(this.aMatchedVarsInCss !== null)
		{
			nLenMatches = this.aMatchedVarsInCss.length;
			for(; nMatched < nLenMatches; nMatched++)
			{
				oMatch = this.aMatchedVarsInCss[nMatched];
				sText = this.lookForVars(sText, oMatch);
			}
		}
	};
	CssWithVars.prototype.lookForVars = function(sText, sVar)
	{
		var nPosVar = sText.indexOf(sVar);
		if(sVar.length > 0)
		{
			this.lookForRules(this.sText, sVar);
		}
		return sText.substr(nPosVar + sVar.length);
	};
	CssWithVars.prototype.fixKeyDoubleDotBug = function(sValue)
	{
		var nPosBracket = sValue.indexOf("}");

		if(nPosBracket !== -1){
			sValue = sValue.substr(0, nPosBracket);
		}
		var nPosDoubleDot = sValue.indexOf(":");

		if(nPosDoubleDot !== -1){
			return false;
		}
		return sValue;
	};
	CssWithVars.prototype.lookForRules = function(sText, sVar)
	{
		var sTextForLookRules = this.sText;
		sVar = sVar.toString();
		var sVarSpecial = sVar.replace("[","\\[");
		sVarSpecial = sVarSpecial.replace("]","\\]");

		sVarSpecial = this.fixKeyDoubleDotBug(sVarSpecial);

		var sVarRegExp = new RegExp(sVarSpecial,"g");

		var sRule = sVar.replace("[","");
		sRule = sRule.replace("]","");

		sRule = this.fixKeyDoubleDotBug(sRule);

		if(sRule){
			var sRuleRegexp = new RegExp(sRule);
			var nPosRule = sTextForLookRules.search(sRuleRegexp);

			sTextForLookRules = sTextForLookRules.substr(nPosRule + sRule.length);

			var sCssInside = sTextForLookRules.substr(sTextForLookRules.indexOf("{") + 1, sTextForLookRules.indexOf("}") - 1);
			sCssInside = sCssInside.replace("{", "").replace("}", "");
			this.sText = this.sText.replace(sVarRegExp, sCssInside);
		}
	};
	CssWithVars.init = function()
	{
		var aLinks = getLinksByMediaType('csswithvars');
		var nLink = 0;
		var nLenLinks = aLinks.length;
		var oLink = null;

		for(; nLink < nLenLinks; nLink++)
		{
			oLink = aLinks[nLink];
			makeAjaxCall(getLinkHref(oLink));
		}
	};
	global.CssWithVars = CssWithVars;
}(window));