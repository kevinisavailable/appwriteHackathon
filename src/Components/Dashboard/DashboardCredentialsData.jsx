import { Button, Card, Input, Loader, PasswordInput, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { deleteACredential, getACredential } from '../../Services/Database/UserCollection'
import { useNavigate } from 'react-router-dom'
import ImageVerification from '../ImageVerification/ImageVerification'

const DashboardCredentialsData = ({id}) => {
  const [credential , setCredential] = useState({})
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate()
  const [open , setOpen] = useState(true)
  const [lock , setLock] = useState(true)
  const onClose = ()=> {setOpen(false)}

  useEffect(() => {
    async function getCredential(){
      setLoading(true)
      const credential = await getACredential(id)
      setCredential(credential)
      setLoading(false)
    }
    getCredential()
  }, [id])

  async function deleteCredential(){
    await deleteACredential(id)
    navigate('/')
  }
  return (
    <div style={{display:'flex' , justifyContent:'flex-start' , marginTop:'2rem'}}>
    <ImageVerification open={open} close={onClose} setLock={setLock}/>
    <Card shadow="sm" padding="xs" radius="md" withBorder style={{width:'50%'}}>
    <div style={{display:'flex' , justifyContent:'space-between'}}>
    <Text weight={500}>{credential.name}</Text>
    {loading &&  <><Loader variant="dots" /></>}
    </div>
    <div style={{margin:'3px 0px' , display:'flex' , flexDirection:'column' ,width:'50%'}}>
    <Input value={credential.id} style={{margin:'3px 0px'}} disabled={lock} readOnly/>
    <PasswordInput value={credential.password} disabled={lock}/>
    </div>
    <Text size="sm" color="dimmed">
       {credential.password}
      </Text>
      <div style={{display:'flex' , flexDirection:'row' , justifyContent:'flex-end' , columnGap:'5px' ,alignItems:'center'}}>
      <Button variant="light" color="blue" radius="md">
        Verify to Unlock
      </Button>
      <Button variant='light' color='red' disabled={lock} onClick={deleteCredential}>Delete</Button>
      </div>
    </Card>      
    </div>
  )
}

export default DashboardCredentialsData