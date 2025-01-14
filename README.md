# Battleships Webapp

## Informacje o projekcie
> **Kurs**: Testowanie i Jakość Oprogramowania<br>
> **Autorzy**: 
> * Bartłomiej Gala - 35201
> * Piotr Dawid - 35195
> 
> **Temat projektu**: Gra w statki online<br>
> **Opis projektu**: Projekt zakłada implementację oraz testowanie serwera oraz aplikacji służącej do prowadzenia wieloosobowych rozgrywek w statki<br>

## Uruchamianie
Sekwencja komend służąca do uruchamiania poszczególnych animacji zaczyna się w katalogó głównym projektu.

### Serwer: 
```
> cd ./server
> npm i
> npm run dev
```

### Frontend
``` 
> cd ./app/battleshipsFrontend
> npm i
> ng serve
```

W konsoli pojawi się adres na którym dostępna jest aplikacja (zazwyczaj http://localhost:4200)

## Testy

### Uruchomienie testów

#### Server
```
> cd ./server
> npm i
> npm t
```

#### Frontend
```
> cd ./app/battleshipsFrontend
> npm i
> ng test
```
Testy stworzone z użyciem Karma twoorzą wynikowy plik html opisujący wsyztskie testy w katalogu `karma_html`
### Testy jednostkowe



| **ID** | TJ_01 |
|-|-|
| **Opis** | Sprawdzenia zapis tokenu do LocalStorage przy logowaniu |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/Auth.spec.ts](/app/battleshipsFrontend/src/app/tests/Auth.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_02 |
|-|-|
| **Opis** | sprawdzenie wylogowania i usuwania tokenu z localStorage oraz przekierowania użytkownika na stronę domową |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/Auth.spec.ts](/app/battleshipsFrontend/src/app/tests/Auth.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_03 |
|-|-|
| **Opis** | Sprawdzenie dekodowania prawidłowego tokenu |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/Auth.spec.ts](/app/battleshipsFrontend/src/app/tests/Auth.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_04 |
|-|-|
| **Opis** | Sprawdzanie, czy funkcja zwraca false, gdy statek wychodzi poza granice siatki poziomo |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/grid.spec.ts](/app/battleshipsFrontend/src/app/tests/grid.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_05 |
|-|-|
| **Opis** | Sprawdzanie, czy funkcja zwraca false, gdy statek wychodzi poza granice siatki pionowo |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/grid.spec.ts](/app/battleshipsFrontend/src/app/tests/grid.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_06 |
|-|-|
| **Opis** | Sprawdzanie, czy funkcja zwraca false, gdy statek nachodzi na istniejący statek |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/grid.spec.ts](/app/battleshipsFrontend/src/app/tests/grid.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_07 |
|-|-|
| **Opis** | Sprawdzanie, czy funkcja zwraca false, gdy statek jest obok innego statku po skosie |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/grid.spec.ts](/app/battleshipsFrontend/src/app/tests/grid.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_08 |
|-|-|
| **Opis** | Sprawdzanie, czy funkcja zwraca true, gdy umiejscowienie statku poziomo jest poprawne |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/grid.spec.ts](/app/battleshipsFrontend/src/app/tests/grid.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_09 |
|-|-|
| **Opis** | Sprawdzanie, czy funkcja zwraca true, gdy umiejscowienie statku pionowo jest poprawne |
| **Plik** | [odnośnik/app/battleshipsFrontend/src/app/tests/grid.spec.ts](/app/battleshipsFrontend/src/app/tests/grid.spec.ts) |
| **Autor** | Piotr Dawid |


| **ID** | TJ_10 |
|-|-|
| **Opis** | Sprawdzenie  załadowania danych rankingowych podczas inicjalizacji komponentu |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/ranking.spec.ts](/app/battleshipsFrontend/src/app/tests/ranking.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TJ_11 |
|-|-|
| **Opis** | Sprawdzanie dostępu do pola wewnątrz planszy |
| **Plik** | [/server/tests/Board.test.ts](/server/tests/Board.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_12 |
|-|-|
| **Opis** | Sprawdzanie dostępu do pola wewnątrz planszy |
| **Plik** | [/server/tests/Board.test.ts](/server/tests/Board.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_13 |
|-|-|
| **Opis** | Sprawdzanie czy pole jest domyślnie puste |
| **Plik** | [/server/tests/Field.test.ts](/server/tests/Field.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_14 |
|-|-|
| **Opis** | Sprawdzanie czy pole jest domyślnie nietrafione |
| **Plik** | [/server/tests/Field.test.ts](/server/tests/Field.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_15 |
|-|-|
| **Opis** | Sprawdzanie czy usługa `JWTService` wyrzuci błąd gdy nie ustawiona jest zmienna środowiskowa `JWT_KEY` |
| **Plik** | [/server/tests/JWTService.test.ts](/server/tests/JWTService.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_16 |
|-|-|
| **Opis** | Sprawdzanie czy liczba punktów zdrowia statku jest poprawnie pobierane |
| **Plik** | [/server/tests/Ship.test.ts](/server/tests/Ship.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_17 |
|-|-|
| **Opis** | Sprawdzanie czy nie da się strzelić w pole nie będące częścią statki |
| **Plik** | [/server/tests/Ship.test.ts](/server/tests/Ship.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_18 |
|-|-|
| **Opis** | Sprawdzanie czy statek jest poprawnie niszczony |
| **Plik** | [/server/tests/Ship.test.ts](/server/tests/Ship.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_19 |
|-|-|
| **Opis** | Sprawdzanie poprawności wysyłanej wiadomości przez `WsAuthMiddleware` |
| **Plik** | [/server/tests/WsAuthMiddleware.test.ts](/server/tests/WsAuthMiddleware.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TJ_20 |
|-|-|
| **Opis** | Test funkcji `AuthMiddleware` |
| **Plik** | [/server/tests/WsAuthMiddleware.test.ts](/server/tests/WsAuthMiddleware.test.ts) |
| **Autor** | Bartłomiej Gala |


### Testy integracyjne

| **ID** | TI_01 |
|-|-|
| **Opis** | sprawdzenie, czy logowanie poprawnie obsługuje błąd |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/iintegrLogin.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/iintegrLogin.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_02 |
|-|-|
| **Opis** | sprawdzenie poprawnego logowania i nawigacji po zalogowaniu |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/iintegrLogin.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/iintegrLogin.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_02 |
|-|-|
| **Opis** | sprawdzenie poprawnego logowania i nawigacji po zalogowaniu |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/iintegrLogin.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/iintegrLogin.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_03 |
|-|-|
| **Opis** | Sprawdzanie, czy statek można umieścić poprawnie poziomo |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_04 |
|-|-|
| **Opis** | Sprawdzanie, że statek **nie jest umieszczany**, jeśli dane wejściowe są błędne |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_05 |
|-|-|
| **Opis** | Sprawdzanie, czy kliknięcie na komórkę w trybie "enemy" powoduje wyemitowanie zdarzenia |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_06 |
|-|-|
| **Opis** |  Sprawdzanie, że kliknięcie na komórkę w trybie "enemy" nie powoduje zdarzenia, jeśli nie jest to tura gracza |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_07   |
|-|-|
| **Opis** | Sprawdzanie funkcji `getCellClass`, aby zwracała poprawne klasy CSS |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_08 |
|-|-|
| **Opis** | Sprawdzanie funkcji `clear`, aby upewnić się, że plansza zostaje wyczyszczona |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/gridIntegr.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_09 |
|-|-|
| **Opis** | Sprawdzanie, czy komponent poprawnie subskrybuje obiekty typu observable w inicjalizacji komponentu |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/integrGame.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/integrGame.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_10 |
|-|-|
| **Opis** | Sprawdzenie wysłania odpowiedzi i oznaczenia kratki na polu po strzale wroga |
| **Plik** | [/app/battleshipsFrontend/src/app/tests/integration/integrGame.spec.ts](/app/battleshipsFrontend/src/app/tests/integration/integrGame.spec.ts) |
| **Autor** | Piotr Dawid |

| **ID** | TI_11 |
|-|-|
| **Opis** | Pobieranie listy wszystkich gier |
| **Plik** | [/server/tests/games.test.ts](/server/tests/games.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_12 |
|-|-|
| **Opis** | Pobieranie listy wszystkich gier danego użytkownika |
| **Plik** | [/server/tests/games.test.ts](/server/tests/games.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_13 |
|-|-|
| **Opis** | Tworzenie użytkownika |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_14 |
|-|-|
| **Opis** | Pobieranie rankingu |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_15 |
|-|-|
| **Opis** | Pobieranie informacji o swoim koncie |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_16 |
|-|-|
| **Opis** | Aktualizowanie swoich danych |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_17 |
|-|-|
| **Opis** | Aktualizowanie cudzych danych |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_18 |
|-|-|
| **Opis** | Usuwanie innego użytkownika |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_19 |
|-|-|
| **Opis** | Usuwanie swojego konta |
| **Plik** | [/server/tests/users.test.ts](/server/tests/users.test.ts) |
| **Autor** | Bartłomiej Gala |

| **ID** | TI_20 |
|-|-|
| **Opis** | Uzyskanie dostępu do sesji WebSocket |
| **Plik** | [/server/tests/session.test.ts](/server/tests/session.test.ts) |
| **Autor** | Bartłomiej Gala |

### Testy manualne
| **ID** | TM_01 |
| - | - |
| **Tytuł** | Zabezpieczenie przed nieautoryzowanym dostępem |
| **Opis** | Niezalogowany użytkownik, niezależnie od wpisanego adresu aplikacji powinien zostać przekierowany na stronę logowania |
| **Warunki początkowe** | Użytkownik nie logował się do aplikacji (localstorage jest pusty) |
| **Kroki testowe** | 1. Wpisz adres http://localhost:4200 w pasku adresu przeglądarki |
| **Oczekiwany rezultat** | Użytkownik zostaje przekierowany do podstrony http://localhost:4200/login w celu zalogowania |

<br>

| **ID** | TM_02 |
| - | - |
| **Tytuł** | Logowanie z poprawnymi danymi |
| **Opis** | Posiadając poprawne dane użytkownik może się zalogować i uzyskać dostęp do aplikacji. |
| **Warunki początkowe** | Użytkownik posiada założone konto i znajduje się na ekranie logowania http://localhost:4200/login |
| **Kroki testowe** | 1. W polu Login wpisz test3 <br> 2. W polu Password wpisz pass<br> 3. Kliknij przycisk Log in|
| **Oczekiwany rezultat** |Przekierowanie na stronę domową http://localhost:4200/home |

<br>

| **ID** | TM_03 |
| - | - |
| **Tytuł** | Logowanie z błędnymi danymi danymi |
| **Opis** | W wypadku podania błędnych danych powinien zostać wyświetlony komunikat o nieudanej autoryzacji |
| **Warunki początkowe** | Nie Istnieje konto o nazwie no_name i haśle no_pass i użytkownik znajduje się na strpnie logowania http://localhost:4200/login |
| **Kroki testowe** | 1. W polu Login wpisz no_name<br> 2. W polu Password wpisz no_pass<br> 3. Kliknij przycisk Log in|
| **Oczekiwany rezultat** | Wyświetlenie komunikatu o treści “Login failed. Please try again” |

<br>

| **ID** | TM_04 |
| - | - |
| **Tytuł** | Próba utworzenia konta o istniejącej nazwie |
| **Opis** | W wypadku podjęcia próby stworzenia konta o nazwie która jest już zajęta, powinien zostać wyświetlony odpowiedni komunikat |
| **Warunki początkowe** | Użytkownik znajduje się na stronie rejestracji http://localhost:4200/register |
| **Kroki testowe** | 1. W polu Login wpisz test3 <br> 2. W polu Password wpisz haslo<br> 3. W polu Email wpisz test@mail.com <br> 4. Kliknij przycisk Sign up|
| **Oczekiwany rezultat** | Powinien zostać wyświetlony komunikat “Username is already taken, try different one” |

<br>

| **ID** | TM_05 |
| - | - |
| **Tytuł** |Utworzenie konta|
| **Opis** |W przypadku podania poprawnych danych konto ma zostać utworzone |
| **Warunki początkowe** | Nie istnieje konto o nazwie UserFinal, użytkownik znajduje się na ekranie rejestracji http://localhost:4200/register |
| **Kroki testowe** | 1. W polu Login wpisz UserFinal<br> 2. W polu Password wpisz haslo <br> 3. W polu Email wpisz test@mail.com<br> 4. Kliknij przycisk Sign up|
| **Oczekiwany rezultat** | Uzytkownik powinien zostać przeniesiony na ekran logowania http://localhost:4200/login, a podane wcześniej informacje powinny pozwolić na zalogowanie się (jak w przykładzie TM_02) |

<br>


| **ID** | TM_06 |
| - | - |
| **Tytuł** |Wylogowanie|
| **Opis** |W momencie wylogowania, użytkownik powinien zostać przeniesiony na ekran logowania |
| **Warunki początkowe** | Użytkownik jest zalogowany i znajduje się na stronie domowej. |
| **Kroki testowe** | 1. kliknij w przycisk Log Out |
| **Oczekiwany rezultat** | Użytkownik powinien zostać przeniesiony na ekran informujący o konieczności zalogowania http://localhost:4200/login. |

<br>

| **ID** | TM_07 |
| - | - |
| **Tytuł** | Sprawdzanie danych konta i powrót na stronę domową |
| **Opis** | Zalogowany użytkownik powinien móc sprawdzić swoje dane na ekranie Account i wrócić do ekranu domowego |
| **Warunki początkowe** | Użytkownik jest zalogowany i znajduje się na stronie domowej. |
| **Kroki testowe** | 1. kliknij w przycisk Your Account<br> 2. Sprawdź dane<br> 3. Kliknij w logo aplikacji |
| **Oczekiwany rezultat** | użytkownik powinien zostać przeniesiony na ekran z informacjami o jego koncie,a po kliknięciu w logo przeniesiony na ekran domowy. |

<br>

| **ID** | TM_08 |
| - | - |
| **Tytuł** | Sprawdzanie rankingu użytkowników |
| **Opis** | Zalogowany użytkownik powinien móc sprawdzić ranking użytkowników |
| **Warunki początkowe** | Użytkownik jest zalogowany i znajduje się na stronie domowej. |
| **Kroki testowe** | 1. kliknij w przycisk Ranking<br> 2. sprawdź dane<br> 3. kliknij w logo aplikacji |
| **Oczekiwany rezultat** | użytkownik powinien zostać przeniesiony na ekran z informacjami o jego koncie,a po kliknięciu w logo przeniesiony na ekran domowy. |

<br>

| **ID** | TM_09 |
| - | - |
| **Tytuł** | Rozpoczęcie Gry Singleplayer |
| **Opis** | Zalogowany użytkownik może  rozpocząć gra Singleplayer z przeciwnikiem komputerowym |
| **Warunki początkowe** |Użytkownik jest zalogowany i znajduje się na stronie domowej. |
| **Kroki testowe** | 1. kliknij w przycisk Singleplayer |
| **Oczekiwany rezultat** | użytkownik zostanie przeniesiony na ekran ustawiania statków |

<br>

| **ID** | TM_10 |
| - | - |
| **Tytuł** | Rozpoczęcie Gry Multiplayer |
| **Opis** | Zalogowany użytkownik może rozpocząć grę Multiplayer z przeciwnikiem online |
| **Warunki początkowe** | Otwarte są dwie instancje aplikacji (najlepiej na dwóch różnych przeglądarkach lub w oknach prywatnych) a obu instancjach aplikacji, użytkownicy są zalogowani i znajdują się na stronie domowej http://localhost:4200/home |
| **Kroki testowe** | 1. Obydwaj użytkownicy klikają przycisk Multiplayer (w dowolnej kolejności) |
| **Oczekiwany rezultat** | Obaj użytkownicy trafiają na ekran wyszukiwania gry. Po chwili (gdy serwer znajdzie przeciwnika do gry), przenoszeni są na ekran ustawiania statków. |

<br>
<table style="width: 100%;">
    <tr>
        <th> <b>ID</b> </th>
        <th> TM_11 </th>
        <th style=" width: 35%"> Obraz pomocniczy </th>
    </tr>
    <tr>
        <td><b>Tytuł<b></td>
        <td>Udane ustawienie statku</td>
        <td rowspan="5"><img src="./maualImages/TM_11_image.png"></td>
    </tr>
    <tr>
        <td><b>Opis<b></td>
        <td>Na ekranie ustawiania statków gracz może zgodnie z zasadami ustawić statki </td>
    </tr>
    <tr>
        <td><b>Warunki początkowe<b></td>
        <td>użytkownik znajduje się na ekranie ustawiania statków, Current Ship Size to 1 , Placing Ship to horizontally, plansza jest pusta (patrz obraz pomocniczy) </td>
    </tr>
    <tr>
        <td><b>Kroki testowe<b></td>
        <td>1. kliknij na komórkę [0][0] (1 wiersz 1 kolumna) </td>
    </tr>
    <tr>
        <td><b>Oczekiwany rezultat<b></td>
        <td>kolor komórki zmienia się na zielony, reprezentując ustawiony statek </td>
    </tr>    
</table>

<br>

| **ID** | TM_12 |
| - | - |
| **Tytuł** | Zmienianie  orientacji stawianego statku |
| **Opis** | Na ekranie ustawiania statków gracz może zmienić orientację ustawianego statku |
| **Warunki początkowe** | użytkownik znajduje się na ekranie ustawiania statków Placing Ship to horizontally |
| **Kroki testowe** | 1. kliknij przycisk Change Orientation |
| **Oczekiwany rezultat** | Placing Ship  zmienia się na vertically, a następne ustawione statki będą pionowe (w dół od klikniętej komórki) |

<br>

| **ID** | TM_13 |
| - | - |
| **Tytuł** | Usuwanie obecnego ustawieia planszy |
| **Opis** | Gracz może usunąć postawione statki i zacząć rozstawianie od nowa |
| **Warunki początkowe** | użytkownik znajduje się na ekranie ustawiania statków, kilka staków jest już ustaione |
| **Kroki testowe** | 1. kliknij przycisk Reset |
| **Oczekiwany rezultat** | Plansza staje się pusta i gracz może na nowo rozstawiać statki |

<br>

| **ID** | TM_14 |
| - | - |
| **Tytuł** | Ustawienie statku poza granicami planszy |
| **Opis** | W przypadku próby ustawienia statku w sposób, który oznaczałby że pola statku znajdowałyby się poza planszą, powinna zakończyć się niepowodzeniem. |
| **Warunki początkowe** |Ustawione zostały cztery statki o rozmiarze 1 na lewej krawędzi ekranu tak aby się nie stykały, Current Ship Size jest równe 2 a placing ships ma wartość horizontally.|
| **Kroki testowe** | 1. Kliknąć skrajnie prawą komórkę pierwszego wiersza. |
| **Oczekiwany rezultat** | Na planszy nie powinien pojawić się statek ponieważ wykraczał by on poza granice planszy. |

<br>
<table style="width: 100%;">
    <tr>
        <th> <b>ID</b> </th>
        <th> TM_15 </th>
        <th style="width: 35%"> Obraz pomocniczy </th>
    </tr>
    <tr>
        <td><b>Tytuł<b></td>
        <td>Ustawienie statku nachodzącego na istniejący</td>
        <td rowspan="5"><img src="./maualImages/TM_14_image.png"></td>
    </tr>
    <tr>
        <td><b>Opis<b></td>
        <td>W przypadku próby ustawienia statku w sposób, który oznaczał by że pola statku nachodziły by na inny statek, powinna zakończyć się niepowodzeniem.</td>
    </tr>
    <tr>
        <td><b>Warunki początkowe<b></td>
        <td>Statki ustawione w sposób widoczny na zdjęciu, Current Ship Size jest równe 2 a placing ships ma wartość vertically.</td>
    </tr>
    <tr>
        <td><b>Kroki testowe<b></td>
        <td>1. Kliknąć komórkę znajdującą się piątej kolumnie i siódmym wierszu. </td>
    </tr>
    <tr>
        <td><b>Oczekiwany rezultat<b></td>
        <td>Na planszy nie powinien pojawić się statek ponieważ nachodziłby on na postawiony wcześniej statek</td>
    </tr>    
</table>
<br>
<table style="width: 100%;">
    <tr>
        <th> <b>ID</b> </th>
        <th> TM_16 </th>
        <th style="width: 35%"> Obraz pomocniczy </th>
    </tr>
    <tr>
        <td><b>Tytuł<b></td>
        <td>Ustawienie statku stykającego się z innym</td>
        <td rowspan="5"><img src="./maualImages/TM_14_image.png"></td>
    </tr>
    <tr>
        <td><b>Opis<b></td>
        <td>W przypadku próby ustawienia statku w sposób, który oznaczałby że pola statku stykają się polami innego staku powinno zakończyć się niepowodzeniem.</td>
    </tr>
    <tr>
        <td><b>Warunki początkowe<b></td>
        <td>Statki ustawione w sposób widoczny na zdjęciu, Current Ship Size jest równe 2 a placing ships ma wartość vertically.</td>
    </tr>
    <tr>
        <td><b>Kroki testowe<b></td>
        <td>1. Kliknąć komórkę znajdującą się szóstej kolumnie i szóstym wierszu.</td>
    </tr>
    <tr>
        <td><b>Oczekiwany rezultat<b></td>
        <td>Na planszy nie powinien pojawić się statek ponieważ dotykałby on innego statku.</td>
    </tr>    
</table>
<br>

| **ID** | TM_17|
| - | - |
| **Tytuł** | Udane oddawanie strzału |
| **Opis** | W grze gracz może w swojej turze strzelić pole wroga jeśli nie strzelił w nie wcześniej, ani nie zniszczył statku sąsiadującego z tym polem |
| **Warunki początkowe** |Gracz znajduje się na ekranie rozgrywki, jest jego tura. pole w 1 wierszu 3 kolumnie nie było wcześniej ostrzelane, ani nie sąsiaduje ze zniszczonym już statkiem(jest czarne). Jest tura gracza|
| **Kroki testowe** | 1. kliknij pole w 1 wierszu 3 kolumnie. |
| **Oczekiwany rezultat** | Kolor pola zmienia się na czerwony jeśli trafiono statek wroga, lub niebieski jeśli nie trafiono statku, tura przechodzi na przeciwnika. |

<br>

| **ID** | TM_18|
| - | - |
| **Tytuł** | Próba strzału w turze wroga |
| **Opis** | W grze gracz nie może strzelić w żadne pole w turze wroga |
| **Warunki początkowe** | Gracz znajduje się na ekranie rozgrywki, jest tura wroga. |
| **Kroki testowe** | 1. kliknij pole w 2 wierszu 7 kolumnie. |
| **Oczekiwany rezultat** | Nic się nie dzieje. |

<br>

| **ID** | TM_19|
| - | - |
| **Tytuł** | Próba strzału we wcześniej strzelone pole |
| **Opis** | Gracz nie może strzelać w to samo pole wielokrotnie |
| **Warunki początkowe** | Gracz znajduje się na ekranie rozgrywki, gracz wykonał co najmniej jeden ruch, jest tura gracza |
| **Kroki testowe** | 1. Kliknij we wcześniej trafione pole (oznaczone na niebiesko lub czerwono) |
| **Oczekiwany rezultat** | Nic się nie dzieje. |

<br>

| **ID** | TM_20 |
| - | - |
| **Tytuł** | Koniec rozgrywki |
| **Opis** | Gdy wszystkie statki jednego z graczy są zniszczone, pojawia się komunikat o wyniku, oraz przycisk powrotu do menu |
| **Warunki początkowe** |Gracz znajduje się na ekranie rozgrywki, jest jego tura, przeciwnik ma 1 nie zestrzelone pole statku |
| **Kroki testowe** | 1. kliknij pole zawierające ostatnie pole statku wroga |
| **Oczekiwany rezultat** | Gracz przenosi się na ekran końca gry z informacją o jego zwycięstwie |

<br>

## Technologia
Technologie użyte w projekcie to:
* Anguar + TypeScript (frontend)
* ExpressJS + TypeScipt (backend)
* PostgreSQL (baza danych)

## Opis API
API dla serwera dzieli się na dwie części:
* API REST - do podstawowej komunikacji z serwerem (logowanie, pobieranie rankingów etc.)
* WebSocket - w celu komunikacji w czasie rzeczywistym (rozgrywka)

### REST

#### Logowanie i autoryzacja
<details>
 <summary><code>POST</code> <code><b>/api/session/create</b></code> - Logowanie do aplikacji</summary>

##### Parametry zapytania

> Brak

##### Parametry body
> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `name` |  tak | string | Nazwa użytkownika |
> | `password` |  tak | string | hasło użytkownika |
##### Przykładowe body:
```json
{
    "name": "string",
    "password": "string"
}
```

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `201` | `application/json` | `{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7I…0MjF9.cZjxglLmfpatltdNOqBZ9qgcMM_lEr-FUIM5nRutN4Y"}` |
> | `401` | `text/html;charset=utf-8` | `Invalid Password` |
> | `500` | `text/html;charset=utf-8` | ` Unknown Error ` |

</details>
<details>
 <summary><code>POST</code> <code><b>/api/session/delete</b></code> - Wylogowywanie z aplikacji</summary>

##### Parametry zapytania

> Brak

##### Parametry body

> Brak

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `400` | `text/html;charset=utf-8` | `Token Missing` |
> | `200` | `text/html;charset=utf-8` | Brak |

</details>

<details>
 <summary><code>POST</code> <code><b>/api/session/game/create</b></code> - Autoryzacja sesji WebSocket</summary>

##### Parametry zapytania

> Brak

##### Parametry body

> Brak

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |


##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `401` | `text/html;charset=utf-8` | `Token Missing` |
> | `201` | `application/json` | `{"sessionKey": "sessionKey"}`|

</details>

#### Wyświetlanie danych o użytkownikach
<details>
 <summary><code>GET</code> <code><b>/api/users</b></code> - Pobieranie listy wszystkich użytkowników</summary>

##### Parametry zapytania

> Brak

##### Parametry body
> Brak

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `200` | `application/json` | `[{"name": "user1", "score", 1234},...]` |
> | `500` | `text/html;charset=utf-8` | Brak |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/users/{name}</b></code> - Pobieranie informacji o danym użytkowniku</summary>

##### Parametry zapytania

> Brak

##### Parametry body
> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `name` |  tak | string | Nazwa użytkownika |

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `200` | `application/json` | `{"name": "test1", "email": "test@mail.com", "score": 1234}` |
> | `404` | `text/html;charset=utf-8` | `User not found` |
> | `500` | `text/html;charset=utf-8` | Brak |

</details>

#### Zarządzanie kontem

<details>
 <summary><code>POST</code> <code><b>/api/users/create</b></code> - Utworzenie konta użytkownika</summary>

##### Parametry zapytania

> Brak

##### Parametry body
> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `name` |  tak | string | Nazwa użytkownika |
> | `email` |  tak | string | Adres Email użytkownika |
> | `password` |  tak | string | Hasło użytkownika |
##### Przykładowe body:
```json
{
    "name": "string",
    "email": "test@mail.com",
    "password": "string"
}
```

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `201` | `application/json` | Brak|
> | `400` | `text/html;charset=utf-8` | `Invalid data format` |
> | `400` | `text/html;charset=utf-8` | `Name already in use` |
> | `500` | `text/html;charset=utf-8` | `Failed to create user` |

</details>
<details>
 <summary><code>PATCH</code> <code><b>/api/users/user/{name}/update</b></code> - Aktualizacja danych konta użytkownika</summary>

##### Parametry zapytania

> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `name` |  tak | string | Nazwa użytkownika |

##### Parametry body
> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `email` |  nie | string | Nowy adres email |
> | `password` |  nie | string | Nowe hasło |

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Przykładowe body:
```json
{
    "password": "string",
    "email": "string@mail.com",
}
```

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `204` | `text/html;charset=utf-8` | `Email updated` |
> | `204` | `text/html;charset=utf-8` | `Password updated` |
> | `400` | `text/html;charset=utf-8` | `Invalid Email` |
> | `403` | `text/html;charset=utf-8` | `Action is forbidden` |
> | `404` | `text/html;charset=utf-8` | `No such user` |
> | `500` | `text/html;charset=utf-8` | `Failed when updating email` |
> | `500` | `text/html;charset=utf-8` | `Failed when updating password` |

</details>
<details>
 <summary><code>DELETE</code> <code><b>/api/users/user/{name}/update</b></code> - Usuwanie konta użytkownika</summary>

##### Parametry zapytania

> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `name` |  tak | string | Nazwa użytkownika |

##### Parametry body
> Brak

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `204` | `text/html;charset=utf-8` | Brak |
> | `403` | `text/html;charset=utf-8` | `Action is forbidden` |
> | `404` | `text/html;charset=utf-8` | `No such user` |
> | `500` | `text/html;charset=utf-8` | `Failed when deleting email` |

</details>

#### Pobieranie informacji na temat history rozgryweg 

<details>
 <summary><code>GET</code> <code><b>/api/games/all</b></code> - Pobieranie wszystkich rozgrywek</summary>

##### Parametry zapytania

> Brak

##### Parametry body
> Brak

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `200` | `application/json` | `[{"gameId": 1, "player1Name": "test1", "player2Name": "test2", "player1Winner", true, "length": 53}]`|
> | `404` | `text/html;charset=utf-8` | `No games found` |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/games/user/{user}</b></code> - Pobieranie wszystkich rozgrywek przeprowadzonych przez danego gracza</summary>

##### Parametry zapytania

> | Nazwa |  wymagany | typ | opis |
> |-|-|-|-|
> | `name` |  tak | string | Nazwa użytkownika |

##### Parametry body
> Brak

##### Nagłówki zapytania

> | Nazwa nagłówka | zawartość | Opis |
> |-|-|-|
> |`Authorization` | `Bearer: `| Nagłówek zawierający token JWT |

##### Odpowiedzi

> | kod HTTP | content-type | odpowiedź |
> |-|-|-|
> | `200` | `application/json` | `[{"gameId": 1, "player1Name": "test1", "player2Name": "test2", "player1Winner", true, "length": 53}]`|
> | `404` | `text/html;charset=utf-8` | `No games found` |

</details>

### WebSocket

Wiadomości wymieniane w trakcie komunikacji stosują format JSON

#### Wiadomości wysyłane przez aplikację
<details>
 <summary><code><b>start-search</b></code> - Wiadomość rozpoczynająca wyszukiwanie rozgrywki</summary>

##### JSON
```json
{
    "sessionKey": "7aed1893-964f-485d-b1d6-30ff08256058",
    "gameType": "singleplayer"
}
```

Wartość `gameType` może przyjąć wartości: 
* `singleplayer` - dla rozgrywki jednoosobowej
* `multiplayer` - dla rozgrywki wieloobowej
</details>
<details>
 <summary><code><b>set-ships</b></code> - Wiadomość przesyłająca ustawienie statków gracza na server</summary>

##### JSON
```json
{
     "sessionKey": "7aed1893-964f-485d-b1d6-30ff08256058",
    "ships": [
        {"shipSize": 1, "position": {"x": 1, "y": 0}, "vertically": false},
        {"shipSize": 1, "position": {"x": 1, "y": 3}, "vertically": false},
        {"shipSize": 1, "position": {"x": 1, "y": 6}, "vertically": false},
        {"shipSize": 1, "position": {"x": 1, "y": 8}, "vertically": false},
        {"shipSize": 2, "position": {"x": 3, "y": 8}, "vertically": false},
        {"shipSize": 2, "position": {"x": 3, "y": 6}, "vertically": false},
        {"shipSize": 2, "position": {"x": 3, "y": 3}, "vertically": false},
        {"shipSize": 3, "position": {"x": 3, "y": 0}, "vertically": false},
        {"shipSize": 3, "position": {"x": 7, "y": 0}, "vertically": false}, 
        {"shipSize": 4, "position": {"x": 6, "y": 3}, "vertically": false} 
    ]
}
```
</details>
<details>
 <summary><code><b>move</b></code> - Wiadomość przesyłająca ustawienie statków gracza na server</summary>

##### JSON
```json
{
    "sessionKey": "68ec4e3b-78af-4b5d-ab69-19cfab23b7d8",
    "message": "move",
    "move": {
        "moveCoordinates": {
            "x": 2,
            "y": 3
        }   
    }
}
```
</details>


#### Wiadomości wysyłane przez serwer
<details>
 <summary><code><b>search-started</b></code> - Wiadomość informująca o rozpoczęciu wysyłania rozgrywki</summary>

##### JSON
```json
{
    "serverTimestamp": "",
    "serverMessage": "search-started"
}
```
</details>
<details>
 <summary><code><b>game-found</b></code> - Wiadomość informująca o znalezieniu rozgrywki oraz przekazująca informacje na temat znalezioner rozgrywki (takie jak nazwa przeciwnika czy układ statków)</summary>

##### JSON
```json
{
    "serverTimestamp": "1736873646272",
    "serverMessage": "game-found",
    "gameSetup": {
        "boardSize": {"x": 10, "y": 10},
        "shipSizes": {
            "1": 4,
            "2": 3,
            "3": 2,
            "4": 1
        }
    },
    "opponent": {
        "name": "test1",
        "score": 123
    }
}
```
</details>
<details>
 <summary><code><b>game-started</b></code> - Wiadomość informująca o rozpoczęciu rozgrywki oraz informująca czyja tura jest pierwsza</summary>

##### JSON
```json
{
    "serverTimestamp": "1736873646272",
    "serverMessage": "game-start",
    "isYourTurn":true
}
```
</details>
<details>
 <summary><code><b>game-update</b></code> - Wiadomość aktualizująca stan rozgrywki</summary>

##### JSON
```json
{
    "serverTimestamp": "1736873646272",
    "serverMessage": "game-update",
    "isYourTurn":true,
    "enemyMove": {"x": 1, "y": 1},
    "wasHit":true,
    "wasSunk":true,
    "turn":10,
    "who":"test1",
    "enemyMove":true,
    "sunkenShip":[
        {"x": 1, "y": 1}
    ]
}
```
</details>
<details>
 <summary><code><b>game-ended</b></code> - Wiadomość informująca o rozpoczęciu rozgrywki oraz informująca czyja tura jest pierwsza</summary>

##### JSON
```json
{
    "serverTimestamp": "1736873646272",
    "serverMessage": "game-start",
    "didYouWin": true,
    "totalTurns": 76,
    "scoreChange" : 123,
    "reason": "ships-destroyed"
}
```
</details>
