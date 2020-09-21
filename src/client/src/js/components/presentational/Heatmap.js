import React, {Component, useEffect, useRef} from 'react'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'
import L from 'leaflet';
import HeatmapOverlay from 'leaflet-heatmap';

export class Heatmap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        }
    }
    position1 = [38.230462, 21.753150]

    cfg = {
        radius: 30,
        maxOpacity: .8,
        scaleRadius: false,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
    };

    heatmapLayer;

    componentDidMount() {
        const map = L.map('map').setView(this.position1, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        this.heatmapLayer = new HeatmapOverlay(this.cfg).addTo(map);
    }

    componentDidUpdate(prevProps,prevState, snapshot) {
        if (this.props.data) {
            this.heatmapLayer.setData({max: 1, data: this.props.data});
        }
    }

    render()
    {
        return (
            <div id="map"/>
        )
    }
}