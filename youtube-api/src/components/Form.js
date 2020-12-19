import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const PlayListForm = () => {
  const [state, setState] = useState({
    PlayListLink: ''
  });

  const [result, setResult] = useState(null);

  const PlayList = event => {
        event.preventDefault();
        event.preventDefault();
    axios
    .post('/api/playlist', { ...state })
    .then(response => {
        setResult(response.data);
        setState({ PlayListLink: ''});
    })
    .catch(() => {
        setResult({ success: false, data: 'Something went wrong. Try again later'});
    });
    
  };

  const onInputChange = event => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value
    });
  };

  return (
    <div>
        {result && (
            <p className={`${result.success ? 'success' : 'error'}`}>
            {result.data}
            </p>
        )}
      <form onSubmit={PlayList}>
        <Form.Group controlId="PlayListLink">
          <Form.Label>Play List Link</Form.Label>
          <Form.Control
            type="text"
            name="PlayListLink"
            value={state.PlayListLink}
            placeholder="Enter The PlayList Link"
            onChange={onInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Get Data
        </Button>
      </form>
    </div>
  );
};

export default PlayListForm;