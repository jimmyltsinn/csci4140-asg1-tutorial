function getFileInfo(obj) {
    $.get("cgi-bin/filelist.cgi?dir=" + obj.dir + "&fn=" + obj.filename, function (data, status) {
        try {
            ret = JSON.parse(data); 
        } catch (err) {
            ret = null;
        }
        var rowObj = $("#" + obj.id); 
        var linkCol = $("<div></div>");
        linkCol.addClass("text-right column small-4"); 
        var modCol = $("<div></div>");
        modCol.addClass(""); 
        //modCol.addClass("columns medium-4"); 
        //modCol.addClass("hide-for-small-only");
        var btn = $("<a></a>");
        btn.addClass("button radius tiny expand"); 
        if (obj.dir != -1 && ret == null) {
            btn.addClass("disabled"); 
            btn.html("Unavailable");
            modCol.html(" ");
        } else {
            if (obj.dir != -1) {
                modCol.append($("<small>Last Modified: " + ret.edittime + "</small>")); 
                btn.html("Download"); 
                btn.attr("href", ret.dir + "/" + obj.filename); 
            } else {
                btn.html("Go"); 
                btn.attr("href", "http://" +  obj.filename); 
            }
        }
        linkCol.append(btn); 
        modCol.appendTo($("#"+obj.id+" div:first-child"));
        linkCol.appendTo(rowObj); 
    }); 
}

function genSpring2015() {
    loadFileList("js/csci4140-spring2015.json");
}

function genSpring2014() {
    loadFileList("js/csci4140-spring2014.json");
}

function loadFileList(jsonUrl) {
    var today = new Date();
    var dd = today.getDate(); 
    var mm = today.getMonth() + 1;
    today = dd + " " + (mm == 1 ? "Jan" : mm == 2 ? "Feb" : mm) + " " + today.getFullYear();

    $.getJSON(jsonUrl, function (data) {
        var topObj = $('#' + data.info.code + '-' + data.info.yr); 
//topObj.empty();

        var headerObj = $("<h4>"+data.info.title+" <small>"+data.info.desc+"</small></h4>"); 
        var ulObj = $("<ul class=\'accordion\' data-accordion></ul>");
        ulObj.attr('id', data.info.title);
        for (var t in data) {
            if (t == "info") continue;
            var liObj = $("<li></li>")
            liObj.addClass("accordion-navigation");

            id = data.info.code + '-' + data.info.yr + '-' + t;

            aObj = $("<a></a>");
            aObj.attr("href", "#" + id); 
            aObj.html(" " + data[t].desc); 
            aObj.append(" <small>" + data[t].title + "</small>"); 
            try {
                dateObj = $("<span></span>"); 
                dateObj.addClass("label radius"); 
                dateObj.addClass("success"); 
                dateObj.html("Today"); 
                if (data[t].date == today) {
                    dateObj.prependTo(aObj);
                }
            } catch (err) { }
            
            liObj.append(aObj); 

            var divObj = $("<div id=\"" + id + "\" class=\"content\"></div>");
            liObj.append(divObj);
            liObj.appendTo(ulObj); 
            var cnt = 0; 
            for (var f in data[t]['filelist']) {
                addFile(divObj, data[t]['filelist'][f]);
                cnt++;
            }
            if (cnt == 0) {
                alertObj = $("<div data-alert></div>"); 
                alertObj.addClass("alert-box info"); 
                var tmp = Math.random() * 2;
                if (tmp <= 1)
                    url = 'sandwich.png';
                else
                    url = 'compiling.png';
                alertObj.html("<img src=\'" + url + "\' height=150 />"); 
                alertObj.appendTo(divObj);
            }
        }
        topObj.prepend(headerObj);
        ulObj.appendTo(topObj);
        $(document).foundation()
    }).fail(function() {console.log("Epic Fail");});
}

function addFile(target, file) {
    type = file.type;

    file.id = file.dir + '-' + file.id

    var rowObj = $("<div class=\"row\"></div>");
    rowObj.attr("id", file.id); 

    var titleObj = $("<div></div>");
    titleObj.addClass("columns small-8");

    iconObj = $("<i></i>"); 
    iconObj.addClass("fa"); 
    iconObj.addClass("fa-" + type); 
    titleObj.html(file.title + " ");
    titleObj.append(iconObj); 

    titleObj.appendTo(rowObj);

    rowObj.appendTo(target); 

    getFileInfo(file);
}
