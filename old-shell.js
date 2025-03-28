<script>
            $(document).ready(function() {
                keyboard_terminal = false
                
                // Check if the user is using a mobile device, if yes, enables the keyboard plugin
                if (/Mobi/.test(navigator.userAgent)) {
                    keyboard_terminal=true
                }
    
            
                $('body').terminal({
                    keyboard: keyboard_terminal,
                    list: function() {
                        this.echo('_____________________________________________________');
                        this.echo('The available commands are:\n');
                        this.echo('about        find more about me');
                        this.echo('research     my research interests');
                        this.echo('office       check my office location and office hours');
                        this.echo('contacts     isn\'t it pretty obvious already?');
                        this.echo('latest\t     latest news about my projects and publications');
                        this.echo('_____________________________________________________');
                    },
                    about: function() {
                        const img = $('<img src="./img/pic.png">');
                        this.echo(img);
                        this.echo("Researcher and Ph.D. student")
                        this.echo("     @  Technical University of Munich")
                        this.echo("         Chair of Connected Mobility\n")
                        this.echo("Community Lead")
                        this.echo("     @ Google Developer Group Pisa\n")
                    },
                    research: function() {
                        const img = $('<img src="./img/pic.png">');
                        this.echo("\nMy Research Interests:");
                        this.echo("- Edge service orchestration")
                        this.echo("- Green Computing")
                        this.echo("- Microservices networking")
                        this.echo("- 5G and beyond\n")
                    },
                    office: function() {
                        this.echo("\nOffice hours:");
                        this.echo("Fakultät für Informatik\nBoltzmannstraße 3, 85748 Garching bei München\nOffice: 01.05.061\n --> On appointment\n")
                    },
                    office: function() {
                        this.echo("\nContacts:");
                        this.echo("Fakultät für Informatik\nBoltzmannstraße 3, 85748 Garching bei München\nOffice: 01.05.061\n --> On appointment\n")
                    },
                    contacts: function() {
                        const socials = $('<a href="https://github.com/giobart" style="color: white; text-decoration: none" class="fa fa-github display-5" aria-hidden="true"></a> <a href="https://campus.tum.de/tumonline/pl/ui/$ctx;design=pl;header=max;lang=en/visitenkarte.show_vcard?pPersonenId=38FEFD5355300D4E&pPersonenGruppe=3" style="color: white; text-decoration: none" class="fa fa-briefcase display-5"></a> <a href="https://t.me/gi0bart" style="color: white; text-decoration: none" class="fa fa-telegram display-5"></a> <a href="https://www.facebook.com/giobarty" style="color: white; text-decoration: none" class="fa fa-facebook display-5"></a> <a href="https://mobile.twitter.com/giobarty01" style="color: white; text-decoration: none" class="fa fa-twitter display-5"></a> <a href="mailto:giovanni.bartolomeo@tum.de" style="color: white; text-decoration: none" class="fa fa-envelope display-5"></a>')
                        this.echo(socials)
                    },
                    latest: function() {
                        this.echo("\nPublications:")
                        this.echo("- Oakestra: An Orchestration Framework for Edge Computing")
                        this.echo("  ACM SIGCOMM 2022, DOI:10.1145/3546037.3546056")
                        this.echo("- Oakestra white paper: An Orchestrator for Edge Computing")
                        this.echo("  DOI:2207.01577")
                        this.echo("\nProjects:")
                        this.echo("- Oakestra: Microservice orchestration platform for edge and cloud computing")
                        this.echo("- OakestraNet: Networking plugin that enables semantic routing and load balancing")
                        this.echo("- Who's that pokemon: Web login system based on facial recognition")
                        this.echo("- EtherCrowdfunding: Ethereum DAPP for a crowdfunding platform\n")
                    }
                }, {
                    greetings: '  _____ _                             _ \n / ____(_)                           (_)\n| |  __ _  _____   ____ _ _ __  _ __  _ \n| | |_ | |/ _ \\ \\ / / _` | \'_ \\| \'_ \\| |\n| |__| | | (_) \\   / (_| | | | | | | | |\n \\_____|_|\\___/ \\_/ \\__,_|_| |_|_| |_|_| \n                                                                             \n ____             _        _                            \n|  _ \\           | |      | |                           \n| |_) | __ _ _ __| |_ ___ | | ___  _ __ ___   ___  ___  \n|  _ < / _` | \'__| __/ _ \\| |/ _ \\| \'_ ` _ \\ / _ \\/ _ \\ \n| |_) | (_| | |  | || (_) | | (_) | | | | | |  __/ (_) |\n|____/ \\__,_|_|   \\__\\___/|_|\\___/|_| |_| |_|\\___|\\___/ \n\nWelcome to my website! I\'m Giovanni Bartolomeo! \n \nPlease type "list" to see the available commands',
                }
                );
            });
        </script> 