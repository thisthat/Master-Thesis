package weka.api;

import weka.*;
import weka.classifiers.bayes.BayesNet;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

public class HelloWeka {
	public static void main(String[] args) throws Exception{
		System.out.println("Load file");
		String file_1 = "C:\\Users\\this\\Documents\\Thesis\\Application\\dataMining\\export_500\\merge.arff";
		DataSource source = new DataSource(file_1);
		Instances dataset = source.getDataSet();
		//Set the index to the last column
		dataset.setClassIndex(dataset.numAttributes() - 1);
		BayesNet tree = new BayesNet();
		tree.buildClassifier(dataset);
		Instances data = new Instances(name, attInfo, capacity)
	}
}
