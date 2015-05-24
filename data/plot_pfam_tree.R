library(RSQLite)
library(ape)
library(plotrix)
library(TeachingDemos)



plot_protein_label <- function(UPAcc,name,tree2,tree_data,dl=0) {
protein_num = match(c(UPAcc),tree2$tip)	
x_coord = tree_data$xx[protein_num]
y_coord = tree_data$yy[protein_num]

ll=2.5 + dl

lines(c(x_coord*1.05,x_coord*(ll-0.05)),c(y_coord*1.05,y_coord*(ll-0.05)),col="grey33",lty=2)
text(x_coord*ll,y_coord*ll,labels=name,adj=c(1-(x_coord+1)/2,1-(y_coord+1)/2))


}


plot_arc <- function(node,name,radius,tree,dx=0,dy=0) {
	list = extract.clade(tree,node)$tip
	total=length(tree$tip)
	start = match(c(list),tree$tip)[1]
	stop = max(match(c(list),tree$tip),na.rm=T)
	draw.arc(0,0,radius=radius,deg1=(start/total)*360,deg2=(stop/total)*360,lwd=2)
	mid = ((start+stop)/(2*total))* 2 * pi
	text(cos(mid)*radius+dx,sin(mid)*radius+dy,name,adj=c(0,0))
	men = formatC(mean(his_diff_cont[match(c(list),tree2$tip)],na.rm=T) * 100,digits=2,format = "f")
	print(length(list))
	#shadowtext(cos(mid)*radius+dx,sin(mid)*radius-0.25+dy,substitute(paste(bar(Delta~'[His]'),"=",men,'%')),adj=c(0,0),col="black",bg="white")

}




drv <- dbDriver("SQLite")
con <- dbConnect(drv, dbname = "sqldatabase")

tree2 <- read.tree("PF00082_converted.nhx")


his_pro_cont = c()
his_mat_cont = c()
names=c()

dbGetQuery(con,"DELETE FROM temp")
id = 1
for (a in tree2$tip.label)
{
	dbGetQuery(con,"INSERT INTO temp VALUES (?,?)",list(id,a))
	id = id + 1
	dbCommit(con)
}




# Get Histidine content difference values from database

pro_cont <- dbGetQuery(con," SELECT CAST (aacon.content AS REAL),temp.UPAcc  FROM temp INNER JOIN (SELECT CAST ( content AS REAL) content, UPAcc FROM aacontent WHERE aminoacid='H' AND region='NTerm') aacon ON aacon.UPAcc = temp.UPAcc ORDER BY temp.Id ")
his_pro_cont = pro_cont[[1]]
mat_cont <- dbGetQuery(con," SELECT CAST (aacon.content AS REAL)  FROM temp INNER JOIN (SELECT CAST ( content AS REAL) content, UPAcc FROM aacontent WHERE aminoacid='H' AND region='PROT') aacon ON aacon.UPAcc = temp.UPAcc ORDER BY temp.Id ")
his_mat_cont = mat_cont[[1]]
his_diff_cont = his_pro_cont - his_mat_cont

	

euc_list <- dbGetQuery(con,"SELECT Q.UPAcc FROM (SELECT interprodata.UPAcc, interprodata.TaxID FROM interprodata WHERE   interprodata.Start > 70 AND interprodata.Start < 300) Q INNER JOIN taxonomy ON Q.TaxID = taxonomy.TaxID WHERE taxonomy.level = 'superkingdom' AND taxonomy.value = 'Eukaryota'")

bac_list <- dbGetQuery(con,"SELECT Q.UPAcc FROM (SELECT interprodata.UPAcc, interprodata.TaxID FROM interprodata WHERE   interprodata.Start > 70 AND interprodata.Start < 300) Q INNER JOIN taxonomy ON Q.TaxID = taxonomy.TaxID WHERE taxonomy.level = 'superkingdom' AND taxonomy.value = 'Bacteria'")

ach_list <- dbGetQuery(con,"SELECT Q.UPAcc FROM (SELECT interprodata.UPAcc, interprodata.TaxID FROM interprodata  WHERE   interprodata.Start > 70 AND interprodata.Start < 300) Q INNER JOIN taxonomy ON Q.TaxID = taxonomy.TaxID WHERE taxonomy.level = 'superkingdom' AND taxonomy.value = 'Archaea'")

met_list <- dbGetQuery(con,"SELECT Q.UPAcc FROM (SELECT interprodata.UPAcc, interprodata.TaxID FROM interprodata WHERE   interprodata.Start > 70 AND interprodata.Start < 300) Q INNER JOIN taxonomy ON Q.TaxID = taxonomy.TaxID WHERE taxonomy.level = 'kingdom' AND taxonomy.value = 'Metazoa'")

vir_list = dbGetQuery(con,"SELECT Q.UPAcc FROM (SELECT interprodata.UPAcc, interprodata.TaxID FROM interprodata WHERE   interprodata.Start > 70 AND interprodata.Start < 300) Q INNER JOIN taxonomy ON Q.TaxID = taxonomy.TaxID WHERE taxonomy.level = 'kingdom' AND taxonomy.value = 'Viridiplantae'")

fun_list = dbGetQuery(con,"SELECT Q.UPAcc FROM (SELECT interprodata.UPAcc, interprodata.TaxID FROM interprodata WHERE   interprodata.Start > 70 AND interprodata.Start < 300) Q INNER JOIN taxonomy ON Q.TaxID = taxonomy.TaxID WHERE taxonomy.level = 'kingdom' AND taxonomy.value = 'Fungi'")


pdf("subtilases_pfam_tree_4.pdf",width=3.5,height=3.5)
par(ps=6,family="sans",mar=c(0,0,0,0),oma=c(0,0,0,0))
# Set colors
col = rep(0,length(tree2$edge)/2)
col[which.edge(tree2,c(bac_list[[1]]))] = col[which.edge(tree2,c(bac_list[[1]]))] + 4

col[which.edge(tree2,c(euc_list[[1]]))] = col[which.edge(tree2,c(euc_list[[1]]))] + 2
col[which.edge(tree2,c(ach_list[[1]]))] = col[which.edge(tree2,c(ach_list[[1]]))] + 3

col[col>4] = "grey33"
col[col==0] = "grey33"

colbar = rep("grey33",length(tree2$tip))
colbar[match(c(bac_list[[1]]),tree2$tip)] = 4
colbar[match(c(ach_list[[1]]),tree2$tip)] = 3

colbar[match(c(euc_list[[1]]),tree2$tip)] = 2


# Plot Tree
tree3 <- tree2
plot(tree3,type="radial",x.lim=c(-3,3),edge.color=col,show.tip.label =F)
tree_data <- get("last_plot.phylo", envir = .PlotPhyloEnv)

#Plot protein labels
#plot_protein_label("P09958","Furin",tree2,tree_data,dl=0)
#plot_protein_label("P04189","Subtilisin",tree2,tree_data,dl=-0.4)
#plot_protein_label("P08594","Aqualysin",tree2,tree_data)
#plot_protein_label("Q8RR56","Kumamolisin",tree2,tree_data,dl=-0.3)
#plot_protein_label("P29120","PC1",tree2,tree_data,dl=0.8)
#plot_protein_label("Q8NBP7","PC9",tree2,tree_data)
#plot_protein_label("P16519","PC2",tree2,tree_data,dl=1)
#plot_protein_label("Q6UW60","PC4",tree2,tree_data,dl=0.3)
#plot_protein_label("Q92824","PC5",tree2,tree_data,dl=0.4)
#plot_protein_label("P29122","PC6",tree2,tree_data,dl=0.65)
#plot_protein_label("Q16549","PC7",tree2,tree_data,dl=-0.2)
#plot_protein_label("P13134","Kexin",tree2,tree_data,dl=-0.3)
#plot_protein_label("P09232","Cerevisin",tree2,tree_data,dl=0.3)
#
#plot_protein_label("O14773","TPP-1",tree2,tree_data,dl=-0.3)
#plot_protein_label("Q14703","SKI-1",tree2,tree_data,dl=-0.3)
#plot_protein_label("P06873","Proteinase K",tree2,tree_data,dl=-0.3)
#plot_protein_label("Q9LLL8","XSP1",tree2,tree_data,dl=-0.3)
#plot_protein_label("O65351","ARA12",tree2,tree_data,dl=0)
#plot_protein_label("Q39547","Cucumisin",tree2,tree_data,dl=0.6)
#plot_protein_label("Q60106","Xanthomonalisin",tree2,tree_data,dl=0.6)

#plot_protein_label("P13134","Kexin",tree2,tree_data,dl=-0.3)
#plot_protein_label("P04189","Subtilisin",tree2,tree_data,dl=-0.4)
#plot_protein_label("P06873","Proteinase K",tree2,tree_data,dl=-0.3)
#plot_protein_label("Q63JI2","Sedolisin",tree2,tree_data)
        
# Kexin/PC: 6618
# Subtilisin: 10988
# Pyrolysin/Cucumisin: 7993
# Proteinase K: 10039
# Sedolisins: 9508
plot_arc(6618,"Kexin/PCs",2.5,tree3,0.3,-0.1)
plot_arc(10988,"Subtilisin",2.5,tree3,0.2,-0.2)
plot_arc(7993,"Pyrolysin/Cucumolisin",2.5,tree3,-1.2,0.35)
plot_arc(10039,"Proteinase K",2.5,tree3,-0.7,-0.3)
plot_arc(9508,"Sedolisin",2.4,tree3,-0.8)



# Plot histidine Difference Data
for (a in c(1:length(tree2$tip.label))) {
	lines(c(tree_data$xx[a]* 1.5,tree_data$xx[a] *1.5 + tree_data$xx[a] * his_diff_cont[a] * 8),c(tree_data$yy[a] *1.5 ,tree_data$yy[a] * 1.5 + tree_data$yy[a] * his_diff_cont[a] * 8),col=colbar[a] )
	
	}
	


# Draw 0 +1 -1 % circles
draw.circle(0,0,radius=1.5,lwd=1)
draw.circle(0,0,radius=1.5+0.08,lwd=1,lty=2)
draw.circle(0,0,radius=1.5-0.08,lwd=1,lty=2)


dev.off()