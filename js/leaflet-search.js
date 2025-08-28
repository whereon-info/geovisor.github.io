/* 
 * Leaflet Control Search v2.7.0 - 2016-09-13 
 * 
 * Copyright 2016 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demo: 
 * http://labs.easyblog.it/maps/leaflet-search/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-search.git 
 * 
 */
L.Control.Search = L.Control.extend({

    // Usamos la API moderna de Leaflet
    includes: L.Evented.prototype,

    options: {
        url: '',
        propertyName: 'title',
        propertyLoc: 'loc',
        formatData: null,
        filterData: null,
        moveToLocation: function(latlng, title, map) {
            if (latlng) map.setView(latlng, 15);
        },
        buildTip: function(text, val) {
            return '<a href="#">' + text + '</a>';
        },
        container: '',
        zoom: null,
        minLength: 2,
        initial: true,
        casesensitive: false,
        autoType: true,
        delayType: 400,
        tooltipLimit: -1,
        autoCollapse: false,
        autoCollapseTime: 1200,
        textPlaceholder: 'Search...',
        position: 'topleft',
        marker: {
            icon: false,
            animate: true
        },
        textErr: 'Not found',
        textCancel: 'Cancel',
        jsonpParam: null,
        layer: null,
        initialVal: ''
    },

    initialize: function(options) {
        L.Util.setOptions(this, options || {});
        this._inputMinSize = this.options.minLength;
        this._recordsCache = {};
        this._curReq = null;
    },

    onAdd: function(map) {
        this._map = map;

        this._container = L.DomUtil.create('div', 'leaflet-control-search');
        this._input = L.DomUtil.create('input', 'search-input', this._container);
        this._input.type = 'text';
        this._input.placeholder = this.options.textPlaceholder || 'Search...';

        this._map.on('layeradd layerremove', this._handleLayers, this);

        L.DomEvent
            .on(this._input, 'keyup', this._onKeyUp, this)
            .on(this._input, 'focus', this._showTooltip, this)
            .on(this._input, 'blur', this._hideTooltip, this);

        return this._container;
    },

    _onKeyUp: function(e) {
        var value = this._input.value;

        if (value.length >= this._inputMinSize) {
            this._doSearch(value);
        }
    },

    _doSearch: function(text) {
        var self = this;
        if (this._curReq) this._curReq.abort();

        if (this.options.url) {
            this._curReq = L.Control.Search.callAjax(this.options.url + text, function(data) {
                self._recordsCache = data;
                self._showTooltip();
            });
        }
    },

    _showTooltip: function() {
        // implementación de resultados
    },

    _hideTooltip: function() {
        // limpiar tooltip
    }
});

// Utilidad para AJAX simple
L.Control.Search.callAjax = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText);
            callback(data);
        }
    };
    request.send();
    return request;
};

L.control.search = function(options) {
    return new L.Control.Search(options);
};
