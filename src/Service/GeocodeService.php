<?php
namespace App\Service;

/**
 * Class GeocodeService
 */
class GeocodeService
{
    /**
     * @var string
     */
    private $geocodeBackendKey;

    /**
     * Constructor.
     *
     * @param $geocodeBackendKey
     */
    public function __construct($geocodeBackendKey)
    {
        $this->geocodeBackendKey = $geocodeBackendKey;
    }

    /**
     * @param float $lat
     * @param float $lng
     * @param string $default
     * @return string
     */
    public function getNeighborhood($lat, $lng, $default = 'Earth')
    {
        $resp = $this->doRequest([
            'latlng' => "${lat},${lng}",
            'sensor' => 'false'
        ]);
        foreach($resp['results'] as $result) {
            foreach($result['types'] as $type) {
                if ($type === 'neighborhood') {
                    return $result['formatted_address'];
                }
            }
        }

        return $default;
    }

    /**
     * @param array $params
     *
     * @return mixed
     */
    private function doRequest($params)
    {
        $query = http_build_query(array_merge($params, [
            'key' => $this->geocodeBackendKey
        ]));
        $url = "https://maps.googleapis.com/maps/api/geocode/json?${query}";
        $resp = file_get_contents($url);

        return json_decode($resp, true);
    }
}
