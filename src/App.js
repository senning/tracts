import { useEffect, useState } from 'react'
import { Box, CircularProgress, List } from '@mui/material';
import Tract from "./components/Tract";
import TractDetails from './components/TractDetail';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tracts, setTracts] = useState([]);
  const [activeTract, setActiveTract] = useState();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch('http://localhost:5000/tracts', { signal })
      .then(res => res.json())
      .then(data => {
        if(data.tracts){
          setIsError(false)
          setTracts(data.tracts)
        }
      })
      .catch(() => {
        setIsError(true)
      })
      .finally(() => {
        setIsLoading(false);
      })
    
    return () => { controller.abort() }
  }, [])

  return (
    <Box
      display='flex'
      flexDirection='row'
      width='100%'
      justifyContent='center'
      bgcolor='grey.50'
      gap={2}
      p={2}
      alignItems='flex-start'
    >
      {
        isLoading && <CircularProgress />
      }
      {
        isError && <p>Error</p>
      }
      {
        tracts && (
          <List>
            {
              tracts.map(tract => (
                <Tract
                  key={tract.fid}
                  {...tract}
                  onClick={fid => setActiveTract(fid)}
                />          
              ))
            }
          </List>
        )
      }
      {
        activeTract 
        && <TractDetails fid={activeTract} />
      }
    </Box>
  );
}

export default App;
