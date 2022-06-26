import { styled } from '@mui/material/styles'
import { ListItemButton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress, { linearProgressClasses} from '@mui/material/LinearProgress'

import counties from '../../constants/counties'

const Separator = () => (
  <Typography
    as="span"
    display="inline-block"
    color="text.secondary"
    px={2}
  > | </Typography>
)

const AreaIndicator = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.primary[theme.palette.mode === 'light' ? 'main' : 'dark'],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.success[theme.palette.mode === 'light' ? 'light' : 'dark'],
  },
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 5,
  display: 'block',
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

const Tract = ({
  fid,
  state,
  county,
  name,
  areaLand,
  areaWater,
  lat,
  lon,
  onClick,
}) => {

  const totalArea = areaLand + areaWater;
  const percentLand = totalArea 
    ? (areaLand / totalArea) * 100 
    : false;

  return(
    <StyledListItem 
      onClick={e => onClick(fid)}
    >
      <div pb='4'>
        <Typography
          variant="h2"
          fontSize={16}
          fontWeight={800}
          display='inline'
        >{name}</Typography>
        <Separator />
        {
          counties[county] && (
            <Typography
              fontSize={12}
              fontWeight={800}
              color="GrayText"
              display='inline'
            >{counties[county]}</Typography>
          )
        }
      </div>
      { percentLand !== false && (
        <AreaIndicator
          variant='determinate'
          value={percentLand}
        />
      )}
    </StyledListItem>
  )
}

export default Tract;