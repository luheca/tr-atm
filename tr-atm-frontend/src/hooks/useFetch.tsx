import { useEffect, useState } from 'react';

export function useFetch<T>(
    url: string,
    body: object | null,
    bearerToken?: string | null,
    refetch?: boolean | null
): { data: T; loading: boolean; error: string | null } {
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const httpHeaders = {
        'Content-Type': 'application/json; charset=utf-8',
    };

    const headers: Headers = new Headers(httpHeaders);
    if (bearerToken)
        headers.append('Authorization', `Bearer ${bearerToken}`);

    const request_options: RequestInit = {
        method: 'POST',
        headers: headers,
    };
    request_options.body = typeof body === 'string' ? body : JSON.stringify(body);
    const request = new Request(url, request_options);

    useEffect(() => {
        if (refetch !== null) {
            setLoading(true);
            const request$ = fetch(request);
            request$
                .then(async (statusResp: Response) => {
                    let resp;
                    if (statusResp.ok) {
                        resp = await statusResp.clone().json(); // Success and valid JSON returned
                        return resp;
                    } else if (statusResp.status === 400 ) {
                        resp = await statusResp.clone().json(); // CLient error and valid JSON returned
                        throw {
                            status: statusResp.status,
                            data: resp || { message: 'Request failed' },
                        };
                    } else {
                        throw new Error('Error occured');
                    }
                })
                .then((res) => {
                    setData(res);
                    setError(null);
                })
                .catch((err) => {
                    const errorMessage = err.data?.message || err.message || "An unknown error occurred"
                    setData(null);
                    setError(errorMessage);
                })
                .finally(() => setLoading(false));
        }
    }, [refetch]);

    return { data, loading, error };
}

export default useFetch;