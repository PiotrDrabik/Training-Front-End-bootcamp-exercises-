
function datafn(data) {
    console.log("Sukces");
    console.log(data);
};

function errorfn(error) {
    console.log("Wystąpił błąd!");
    console.log(error);
};

    function feetch(url, data, error) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
       
        xhr.onreadystatechange = function(e) {
            console.log(this.readyState);
            if(this.readyState === 4 && this.status === 200) {
                datafn(data);
                document.write(this.responseText);
                //console.log(this.responseText);
            } else ( errorfn(error+xhr.statusText));
        };

        xhr.send(null);
        console.log(xhr.readyState);
    };

if (fetch) //it should be !fetch
{ 
    console.log("jest fetch");
    feetch("https://jsonplaceholder.typicode.com/users","It's perfect!","Message: ");
};


