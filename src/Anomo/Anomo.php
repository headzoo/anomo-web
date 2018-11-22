<?php
namespace App\Anomo;

use GuzzleHttp;
use Psr\Log\LoggerInterface;

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
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * Constructor
     *
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger)
    {
        $this->logger    = $logger;
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
        $url = $this->endpoints->create($endpoint, $endpointParams);
        $this->logger->debug("ANOMO: GET ${url}");

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
