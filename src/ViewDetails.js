import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function ViewDetails(){

    const { imdbID } = useParams()

    const [data, setData]=useState(null)

    useEffect (() =>{
        const getData =async()=>{
           try{
             let apipath=`http://www.omdbapi.com/?apikey=885c5bb8&i=${imdbID}`
            console.log(apipath)
            let apiResponse= await axios.get(apipath)
            console.log(apiResponse)
            setData({...apiResponse.data})
           }catch (error){
            setData(null)
            alert("Unable to process your request")
           }
           
        }
        getData()

    },[])
    return(
        <div className="container">
            <div className="row justify-content-center mt-5">
                {
                    data != null && 
                    <div className="row ">
                        <div className=" col md-4">
                            <img src={data.Poster} className="img-fluid rounded shadow-md"/>
                            <div className="col md-8">
                                <h2>{data.Title} {data.Year}</h2>
                                <p><strong>Genre:</strong>{data.Genre}</p>
                                <p><strong>Director:</strong>{data.Director}</p>
                                <p><strong>Writer:</strong>{data.Writer}</p>
                                <p><strong>Actors:</strong>{data.Actors}</p>
                                <p><strong>Plot:</strong>{data.Plot}</p>
                                <p><strong>Country:</strong>{data.Country}</p>
                                <p><strong>Language:</strong>{data.Language}</p>
                                <p><strong>Awards:</strong>{data.Awards}</p>
                                <p><strong>IMDB Rating: </strong>{data.imdbRating}</p>

                            </div>

                        </div>

                    </div>
                }
            </div>
        </div>
    )

}
export default ViewDetails