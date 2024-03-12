<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class XApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        // Check the presence and validity of the x-api-token header
        $token = $request->header('x-api-key'); 
        if ($token == env('AG_CORE_API_KEY')) {
            return $next($request);
        } else {
            return response('Unauthorized', 401);
        }
    }
}
