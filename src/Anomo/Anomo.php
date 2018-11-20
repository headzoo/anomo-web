<?php
namespace App\Anomo;

use GuzzleHttp;

/**
 * Class Anomo
 */
class Anomo
{
    /**
     * @var GuzzleHttp\Client
     */
    protected $guzzle;

    /**
     * @var Endpoints
     */
    protected $endpoints;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->guzzle    = new GuzzleHttp\Client();
        $this->endpoints = new Endpoints();
    }

    /**
     * @return Endpoints
     */
    public function getEndpoints()
    {
        return $this->endpoints;
    }

    /**
     * @param string $endpoint
     * @param array $endpointParams
     * @return array
     */
    public function get($endpoint, $endpointParams = [])
    {
        $url      = $this->endpoints->create($endpoint, $endpointParams);
        $response = $this->guzzle->request('GET', $url);
        $body     = trim((string)$response->getBody());

        return json_decode($body, true);
    }

    /**
     * @param string $endpoint
     * @param array $endpointParams
     * @param array $body
     * @return array
     */
    public function post($endpoint, $endpointParams = [], $body = [])
    {
        $url    = $this->endpoints->create($endpoint, $endpointParams);
        $params = [];
        if ($body) {
            $params['form_params'] = $body;
        }
        $response = $this->guzzle->request('POST', $url, $params);
        $body     = trim((string)$response->getBody());

        return json_decode($body, true);
    }
}
