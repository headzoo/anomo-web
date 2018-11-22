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
        return $this->send('GET', $url);
    }

    /**
     * @param string $endpoint
     * @param array $endpointParams
     * @param array $body
     * @return array
     */
    public function post($endpoint, $endpointParams = [], $body = [])
    {
        $url = $this->endpoints->create($endpoint, $endpointParams);
        $params = [];
        if ($body) {
            if (isset($body['multipart'])) {
                $params = $body;
            } else {
                $params['form_params'] = $body;
            }
        }

        return $this->send('POST', $url, $params);
    }

    /**
     * @param string $method
     * @param string $url
     * @param array $body
     * @return mixed
     */
    protected function send($method, $url, $body = [])
    {
        $this->logger->debug("ANOMO: ${method} ${url}", $body);
        $response = $this->guzzle->request($method, $url, $body);

        return json_decode(trim((string)$response->getBody()), true);
    }
}
