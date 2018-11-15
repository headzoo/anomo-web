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
     * @param string $name
     * @param array $params
     * @return string
     */
    public function endpoint($name, $params = [])
    {
        return $this->endpoints->create($name, $params);
    }

    /**
     * @param string $url
     * @return array
     */
    public function get($url)
    {
        return [];
    }

    public function post($url, $body = [])
    {

    }
}
