<?php

namespace App\Anomo;

class Endpoints
{
    /**
     * @var array
     */
    protected static $endpoints = [
        'activityFetch' => '/activity/get_activities/{token}/1/0/-1/0/18/100/{lastActivityID}/0'
    ];

    /**
     * @var array
     */
    protected $defaultParams = [];

    /**
     * @param string $name
     * @param string $value
     * @return $this
     */
    public function setDefaultParam($name, $value)
    {
        $this->defaultParams[$name] = $value;
        return $this;
    }

    /**
     * @param string $endpoint
     * @param array $params
     * @return string
     */
    public function create($endpoint, $params = [])
    {
        $url = self::$endpoints[$endpoint];
        foreach(array_merge($this->defaultParams, $params) as $name => $value) {
            $url = str_replace('{' . $name . '}', $value, $url);
        }

        return $url;
    }
}
