import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { account } from '../../Services/Appwrite/AppwriteConfig';
import { createUserOnDb, getUserByEmail } from '../../Services/Database/UserCollection';
import Layout from '../Layout/Layout';

const ProtectedAuth = ({children}) => {
    const [sessionExists ,setSessionExists] = useState(false)
    const [isImageUploaded , setIsImageUploaded] = useState(true)
    const navigate = useNavigate();
    useEffect(() => {
      async function getSession(){
            const session = await account.getSession('current')
            if(session){
                setSessionExists(true)
                const authUser = await account.get()
                if(authUser.email){
                    const userFromDb = await getUserByEmail(authUser.email)
                    if(userFromDb.total === 0){
                        await createUserOnDb(authUser)
                    }else{
                        if(userFromDb.documents[0].isImageUploaded === false)
                        setIsImageUploaded(false)
                    }
                }
            }else{
                navigate('/')
            }
      }
      getSession()
    }, [])
    

    if(sessionExists){
        return(<>
            <Layout isImageUploaded={isImageUploaded}>
                {children}
            </Layout>
        </>)
    }
}

export default ProtectedAuth