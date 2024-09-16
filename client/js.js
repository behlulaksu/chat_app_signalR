$(document).ready(
    () => {

        var selected_client = "All Users";//mesaj gondermede hedef client. Eger secili degil ise birisi, herkese gonderecek sekilde tanimlandi

        /* hub ayarlarinin oldugu alan */
        const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:16507/chatHub")
        .build();

        connection.start();

        /* Hub a kendimizi tanittigimiz alan */
        $("#btnGirisYap").click(
            () => {
                const nicname = $("#txtnicname").val();
                connection.invoke("GetNickName", nicname).catch(error => console.log(error));
            }
        );

        connection.on("clientJoined", nicname => {
            // kimin giris yaptigini bildirim aldigimiz alan
            $("#ClientDurumMesajlari").html(`${nicname} giris yapti`);
            $("#ClientDurumMesajlari").fadeIn(2000, () => {
                setTimeout(()=>{
                    $("#ClientDurumMesajlari").fadeOut(2000);
                },2000)
            });
        });

        connection.on("clients", clients => {
            // aktif olarak kimlerin iceride oldugunu gordugumuz alan
            $("#users").html("");
            $.each(clients, (index, item) => {
                const user = $(".user").first().clone();
                user.html(item.nickName);
                $("#users").append(user);
            })
            
            
        });

        /* kime mesaj gonderecegimizi sectigimiz alan burasi */
        $("body").on("click", ".user", function(){
            const selected_user = this;

            $(".user").each((index, item)=>{
                item.classList.remove("selected_user");
            });
            $(this).addClass("selected_user");
            selected_client = $(this).html();
        });

        /* secili kisiye mesaj gonderdigimiz alan burasi */
        $("#btnGonder").click(
            ()=>{
                message_area_val = $("#message_area").val();
                connection.invoke("SendMessageAsync", message_area_val, selected_client);
            }
        );
       
        /* mesajlari aldigimiz yer */
        connection.on("receiveMessage", (message,nickName) => {
            new_message = document.createElement('div');
            new_message.setAttribute("class", "mesaj_ekle");
            new_message.innerHTML = message+"/"+nickName;
            $(".mesajlarin_tamami").append(new_message);
        });

        /*oda olsuturdugumuz yer burasi*/
        $("#oda_olustur").click( 
            () => {
                const yeni_oda_ismi = $("#oda_ismi").val();
                connection.invoke("AddGroup", yeni_oda_ismi).catch(error => console.log(error));                
            }
        );

        /* yeni acilan odalarin dinlemesini yaptigimiz alan burasi */
        connection.on("groups", groupName => {
            new_oda = document.createElement("option");
            new_oda.setAttribute("class","new_oda");
            new_oda.innerHTML = groupName;
            $("#odalar_listesi").append(new_oda);
        });

        /* Var olan olalardan bir yada daha fazlasina katilma islemi */
        $("#odalara_katil").click(
            () => {
                let groupNames = [];
                $("#odalar_listesi option:selected").map((i,e) => {
                    groupNames.push(e.innerHTML);
                });

                connection.invoke("AddClientToGroup", groupNames);
            }
        );

        /* herhangi bir gurupta kimler var diye baktigimiz alan */

    }
);