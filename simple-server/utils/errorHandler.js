import axios from 'axios';

const handleError = (error, res) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Error response from API:', error.response.data);
      switch (error.response.status) {
        case 400:
          res.status(400).json({ error: 'Bad Request' });
          break;
        case 401:
          res
            .status(401)
            .json({
              error:
                'Unauthorized, You either need an API key or your account tier does not have access to the endpoint.',
            });
          break;
        case 403:
          res.status(403).json({ error: 'Forbidden' });
          break;
        case 404:
          res.status(404).json({ error: 'Not Found' });
          break;
        case 406:
          res.status(406).json({ error: 'Request is not JSON' });
          break;
        case 429:
          res.status(429).json({ error: 'Rate limit reached' });
          break;
        default:
          res
            .status(error.response.status)
            .json({ error: error.response.data });
      }
    } else if (error.request) {
      console.error('No response received from API:', error.request);
      res
        .status(503)
        .json({
          error:
            "We're temporarily offline for maintenance. Please try again later.",
        });
    } else {
      console.error('Error setting up request:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};

export default handleError;
