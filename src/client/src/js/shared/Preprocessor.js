export class Preprocessor {
    parse(location_history) {
        let feature_collection = {
            'type': 'FeatureCollection',
            'features': []
        }

        let locations = location_history.locations;

        for (let location of locations) {
            feature_collection.features.push(...this.parse_features(location));
        }

        return feature_collection;
    }

    parse_features(location) {
        let features = []
        if ('activity' in location) {
            for (let activity of location.activity) {
                features.push({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            location.longitudeE7 / 10000000.0,
                            location.latitudeE7 / 10000000.0
                        ],
                    },
                    'properties': {
                        'timestamp': parseInt(activity.timestampMs, 10),
                        'type': activity.activity[0].type,
                        'confidence': activity.activity[0].confidence,
                        'velocity': parseInt(activity.velocity, 10),
                        'accuracy': parseInt(activity.accuracy, 10),
                        'altitude': parseInt(activity.altitude, 10)
                    }
                });
            }
        }
        return features;
    }
}