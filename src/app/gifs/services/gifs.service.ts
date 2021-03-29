import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
  //nueva particularidad de Angular. Evita tener que especificarlo en los providers. Root significa que ees a nivel global
})
export class GifsService {

  private apiKey : string = 'mcNfLf4xQWoyJ5jqZkSRNFF0pyKcW03e';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string [] = [];

  public resultados: Gif[] =  [];

  get historial() {
    //this._historial = this._historial.splice(0,10);
    return [...this._historial]
  }

 //Sólo se ejecuta la primera vez que es ejecutado.
  constructor ( private http: HttpClient) {
    
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []  //! significa .. "confia en mi, sé lo que estoy haciendo". Devuelve el historial o un arreglo vacio
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [] 



 }


  buscarGifs( query:string ){

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,20);

      localStorage.setItem ('historial', JSON.stringify(this.historial))      
    }  

    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '50')
          .set('q', query );
 
    console.log(query);   
    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params } )
    .subscribe( ( resp ) => {
      this.resultados = resp.data;
      localStorage.setItem ('resultados', JSON.stringify(this.resultados))      
    });  
  }
  
}


/**
 * Solución 1:
 * 
 *   buscarGifs(query:string){

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);
    }    

    fetch('https://api.giphy.com/v1/gifs/search?api_Key=mcNfLf4xQWoyJ5jqZkSRNFF0pyKcW03e&q=dbz&limit=10')
    .then( resp => {
      resp.json().then( data => {
        console.log(data);
        
      })
    })    
  }

}
 * 
 * 
 */


 /**
  * Solución 2:
  * 
  *  async buscarGifs(query:string){

    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);
    }    

    const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_Key=mcNfLf4xQWoyJ5jqZkSRNFF0pyKcW03e&q=dbz&limit=10')
    const data = await resp.json();
    console.log( data );
    
  }

}
  * 
  */