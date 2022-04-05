import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import { useContext } from 'react'

const HomeScreen = () => {
    //const { auth } = useContext(AuthContext);
    //const { store } = useContext(GlobalStoreContext);


    // useEffect(() => {
    //     store.loadIdNamePairs();
    // }, []);
    return (
        <div>
            <h1>Welcome Back!</h1>
        </div>
    )
}

export default HomeScreen;